import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Input,
  Button,
  Form,
  Drawer,
  notification,
  Row,
  Col,
  Select,
} from "antd";
import {
  PlusCircleFilled,
  PlayCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { sendData, getData, updateData } from "../../utils/api";

import TaylorImg from "../../assets/images/taylor.jpeg";
import BillieImg from "../../assets/images/billie.jpeg";
import BrunoImg from "../../assets/images/bruno.jpeg";
import EdImg from "../../assets/images/ed.jpeg";

const { Title, Paragraph } = Typography;
const { Option } = Select;

const groupId = 41;

const Playlist = () => {
  const [playlists, setPlaylists] = useState([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [searchText, setSearchText] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [currentArtistIndex, setCurrentArtistIndex] = useState(0);

  const artistImages = [
    {
      src: TaylorImg,
      title: "Taylor Swift Midnights",
      subtitle: "Listen to trending songs all the time",
      description: "Premium music for free anywhere.",
    },
    {
      src: BillieImg,
      title: "Billie Eilish Collection",
      subtitle: "Experience moody melodies",
      description: "Emotional world of Billie Eilish.",
    },
    {
      src: BrunoImg,
      title: "Bruno Mars Hits",
      subtitle: "Funk & Soul Vibes",
      description: "Rhythm and groove with Bruno Mars.",
    },
    {
      src: EdImg,
      title: "Ed Sheeran Special",
      subtitle: "Romantic & Acoustic",
      description: "Timeless ballads from Ed Sheeran.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentArtistIndex((i) => (i + 1) % artistImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getYouTubeThumbnail = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/);
    return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : "";
  };

  const fetchData = async () => {
    try {
      const data = await getData(`/api/playlist/${groupId}`);
      setPlaylists(data);
    } catch (error) {
      console.error("Gagal mengambil data playlist", error);
    }
  };

  const onFinish = async (values) => {
    if (!values.play_thumbnail && values.play_url) {
      values.play_thumbnail = getYouTubeThumbnail(values.play_url);
    }

    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    try {
      if (editingItem) {
        await updateData(
          `/api/playlist/${groupId}/${editingItem.id}`,
          formData
        );
        api.success({ message: "Berhasil mengedit playlist" });
      } else {
        await sendData(`/api/playlist/${groupId}`, formData);
        api.success({ message: "Berhasil menambahkan playlist" });
      }

      setOpen(false);
      form.resetFields();
      setEditingItem(null);
      fetchData();
    } catch (error) {
      console.error(error);
      api.error({ message: "Gagal menyimpan playlist" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}

      {/* Header */}
      <div
        style={{
          background: "linear-gradient(to right, #FBC2EB, #A6C1EE)",
          padding: 32,
          borderRadius: 12,
          marginBottom: 32,
        }}
      >
        <Title level={2} style={{ color: "#fff", fontWeight: "bold" }}>
          MyPlaylist
        </Title>
        <Paragraph style={{ color: "#fff" }}>
          Manage your video playlist according to your needs.
        </Paragraph>
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col xs={24} sm={16}>
            <Input
              placeholder="Looking for something to vibe with? 🎶"
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
              size="large"
            />
          </Col>
          <Col xs={24} sm={8}>
            <Button
              icon={<PlusCircleFilled />}
              type="primary"
              block
              size="large"
              onClick={() => {
                form.resetFields();
                setEditingItem(null);
                setOpen(true);
              }}
            >
              Add Playlist
            </Button>
          </Col>
        </Row>

        {/* Slideshow */}
        <div
          style={{
            width: "100%",
            aspectRatio: "16 / 6",
            overflow: "hidden",
            borderRadius: 12,
            marginTop: 32,
            position: "relative",
          }}
        >
          <img
            src={artistImages[currentArtistIndex].src}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.7,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "#fff",
              textAlign: "center",
            }}
          >
            <Title level={3} style={{ color: "white" }}>
              {artistImages[currentArtistIndex].title}
            </Title>
            <Paragraph strong style={{ color: "white", fontSize: 18 }}>
              {artistImages[currentArtistIndex].subtitle}
            </Paragraph>
            <Paragraph style={{ color: "white" }}>
              {artistImages[currentArtistIndex].description}
            </Paragraph>
          </div>
        </div>
      </div>

      {/* Playlist Cards */}
      <Row gutter={[16, 16]}>
        {playlists
          .filter((item) =>
            item.play_name.toLowerCase().includes(searchText.toLowerCase())
          )
          .map((item) => (
            <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={
                  <img
                    alt={item.play_name}
                    src={item.play_thumbnail}
                    style={{ height: 160, objectFit: "cover" }}
                  />
                }
                actions={[
                  <a
                    href={item.play_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#1890ff" }}
                  >
                    <PlayCircleOutlined key="play" />
                  </a>,
                  <EditOutlined
                    key="edit"
                    style={{ cursor: "default", opacity: 0.3 }}
                  />,
                  <DeleteOutlined
                    key="delete"
                    style={{ cursor: "default", opacity: 0.3 }}
                  />,
                ]}
              >
                <Card.Meta
                  title={item.play_name}
                  description={
                    <>
                      <Paragraph ellipsis={{ rows: 2 }}>
                        {item.play_description}
                      </Paragraph>
                      <small>Genre: {item.play_genre}</small>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
      </Row>

      {/* Drawer Form */}
      <Drawer
        title={editingItem ? "Edit Playlist" : "Tambah Playlist"}
        placement="right"
        onClose={() => {
          setOpen(false);
          setEditingItem(null);
          form.resetFields();
        }}
        open={open}
        width={400}
      >
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item
            label="Playlist Name"
            name="play_name"
            rules={[{ required: true, message: "Harap isi nama playlist" }]}
          >
            <Input placeholder="Contoh: Suasana Sedih" />
          </Form.Item>
          <Form.Item
            label="URL Video"
            name="play_url"
            rules={[{ required: true, message: "Harap isi URL video" }]}
          >
            <Input placeholder="https://youtube.com/..." />
          </Form.Item>
          <Form.Item label="Thumbnail" name="play_thumbnail">
            <Input placeholder="Opsional, akan otomatis jika kosong" />
          </Form.Item>
          <Form.Item label="Genre" name="play_genre" initialValue="education">
            <Select>
              <Option value="education">Education</Option>
              <Option value="music">Music</Option>
              <Option value="documentary">Documentary</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Description"
            name="play_description"
            rules={[{ required: true, message: "Harap isi deskripsi" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingItem ? "Update" : "Save"}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default Playlist;
