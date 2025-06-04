import {
  Col,
  Row,
  Typography,
  Card,
  List,
  Skeleton,
  FloatButton,
  Drawer,
  Form,
  Input,
  Button,
  notification,
  Popconfirm,
  Empty,
} from "antd";
import { useEffect, useState } from "react";
import { getData, sendData, deleteData } from "../../utils/api";
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";

const { Title, Text, Search } = Typography;

const Gallery = () => {
  const [api, contextHolder] = notification.useNotification();
  const [dataSources, setDataSources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [isSelected, setIsSelected] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchText, setSearchText] = useState("");

  const showAlert = (status, title, description) => {
    api[status]({
      message: title,
      description: description,
    });
  };

  const handleDrawerOpen = () => {
    setIsOpenDrawer(true);
  };

  const onClose = () => {
    setIsOpenDrawer(false);
    setIsEdit(false);
    setIsSelected(null);
    setSelectedFile(null);
    form.resetFields();
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const nameNatures = form.getFieldValue("name_natures");
      const descriptionOfNatures = form.getFieldValue("description_of_natures");

      const formData = new FormData();
      formData.append("name_natures", nameNatures);
      formData.append("description", descriptionOfNatures);
      if (selectedFile) {
        formData.append("photo", selectedFile);
      }

      const url = isEdit
        ? `/api/v1/natures/${isSelected}`
        : "/api/v1/natures";

      const resp = await sendData(url, formData);

      if (resp?.datas) {
        showAlert("success", "Sukses", "Data berhasil disimpan!");
        getDataNatures();
        onClose();
      } else {
        showAlert("error", "Gagal", "Gagal menyimpan data!");
      }
    } catch (err) {
      console.error(err);
      showAlert("error", "Error", "Terjadi kesalahan server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const drawerSection = () => (
    <Drawer
      title={isEdit ? "Edit Nature" : "Add Nature"}
      onClose={onClose}
      open={isOpenDrawer}
      width={400}
    >
      <Form form={form} name="form_natures" layout="vertical">
        <Form.Item
          label="Name of Natures"
          name="name_natures"
          rules={[{ required: true, message: "Please input the name of natures!" }]}
        >
          <Input placeholder="Enter nature name" />
        </Form.Item>
        <Form.Item
          label="Description of Natures"
          name="description_of_natures"
          rules={[{ required: true, message: "Please input the description of natures!" }]}
        >
          <Input.TextArea placeholder="Enter description" rows={3} />
        </Form.Item>
        <Form.Item label="Photo">
          <Input type="file" onChange={handleFileChange} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={isSubmitting}
            block
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={onClose} block>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );

  const getDataNatures = () => {
    setIsLoading(true);
    getData("/api/v1/natures")
      .then((resp) => {
        if (resp) {
          setDataSources(resp);
        } else {
          showAlert("error", "Gagal", "Gagal mengambil data dari server.");
        }
      })
      .catch((err) => {
        console.error(err);
        showAlert("error", "Error", "Terjadi kesalahan saat mengambil data.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const confirmDelete = (id) => {
    deleteData(`/api/v1/natures/${id}`)
      .then(() => {
        showAlert("success", "Sukses", "Data berhasil dihapus!");
        getDataNatures();
      })
      .catch((err) => {
        console.error(err);
        showAlert("error", "Error", "Terjadi kesalahan saat menghapus data.");
      });
  };

  const handleDrawerEdit = (record) => {
    setIsOpenDrawer(true);
    setIsEdit(true);
    setIsSelected(record?.id);
    form.setFieldValue("name_natures", record?.name_natures);
    form.setFieldValue("description_of_natures", record?.description);
  };

  useEffect(() => {
    getDataNatures();
  }, []);

  const filteredData = dataSources?.filter((item) =>
    item?.name_natures?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="layout-content">
      {contextHolder}

      <Row gutter={[24, 0]}>
        <Col xs={24} className="mb-24">
          <Card bordered={false} className="circlebox h-full w-full">
            <FloatButton
              type="primary"
              tooltip={<div>Add Nature</div>}
              icon={<PlusCircleFilled />}
              onClick={handleDrawerOpen}
            />

            {drawerSection()}

            {/* Header + Search */}
            <div style={{ marginBottom: 24 }}>
              <Title level={3} style={{ marginBottom: 0 }}>List of Natures</Title>
              <Text style={{ fontSize: "12pt", display: "block", marginBottom: 16 }}>
                Explore beautiful places.
              </Text>
              <Input
                placeholder="Search nature name..."
                allowClear
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined />}
                style={{
                  width: "100%",
                }}
              />
            </div>

            {isLoading ? (
              <Skeleton active />
            ) : filteredData?.length > 0 ? (
              <List
                grid={{
                  gutter: 16,
                  xs: 1,
                  sm: 1,
                  md: 2,
                  lg: 3,
                  xl: 3,
                }}
                dataSource={filteredData}
                renderItem={(item) => (
                  <List.Item key={item?.id}>
                    <Card
                      hoverable
                      style={{ width: "100%" }}
                      cover={
                        <img
                          src={item?.url_photo || "/images/placeholder.jpg"}
                          alt="nature"
                          style={{ height: 200, objectFit: "cover" }}
                        />
                      }
                      actions={[
                        <EditOutlined key="edit" onClick={() => handleDrawerEdit(item)} />,
                        <SearchOutlined key="search" />,
                        <Popconfirm
                          title="Delete Data"
                          description="Are you sure you want to delete this item?"
                          onConfirm={() => confirmDelete(item.id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <DeleteOutlined key="delete" style={{ color: "red" }} />
                        </Popconfirm>,
                      ]}
                    >
                      <Card.Meta
                        title={item?.name_natures}
                        description={item?.description}
                      />
                    </Card>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="Data tidak ditemukan atau belum tersedia." />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Gallery;
