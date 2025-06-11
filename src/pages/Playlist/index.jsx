import React, { useState, useEffect } from "react";
import {
  Typography,
  notification,
  Card,
  Row,
  Col,
  Skeleton,
  Input,
  Drawer,
  Form,
  Button,
} from "antd";
import { PlusCircleFilled, SearchOutlined } from "@ant-design/icons";
import { addPlaylistToGroup, fetchPlaylistById } from "@/lib/axios/axiosPublic";
import TaylorImg from "../../assets/images/taylor.jpeg";
import BillieImg from "../../assets/images/billie.jpeg";
import BrunoImg from "../../assets/images/bruno.jpeg";
import EdImg from "../../assets/images/ed.jpeg";

const { Title, Text } = Typography;

const banners = [
  {
    image: TaylorImg,
    title: "Listen to trending songs all the time",
    subtitle: "Taylor Swift Midnights",
    description: "With Taylor Swift’s. You can get premium music for free anywhere at any time.",
  },
  {
    image: BillieImg,
    title: "Experience moody melodies",
    subtitle: "Billie Eilish Collection",
    description: "Dive into the deep and emotional world of Billie Eilish's music.",
  },
  {
    image: BrunoImg,
    title: "Funk & Soul Vibes",
    subtitle: "Bruno Mars Hits",
    description: "Enjoy the rhythm and groove with Bruno Mars’ greatest hits.",
  },
  {
    image: EdImg,
    title: "Romantic & Acoustic",
    subtitle: "Ed Sheeran Special",
    description: "Relax and fall in love with Ed Sheeran’s timeless ballads.",
  },
];

const Playlist = () => {
  const [api, contextHolder] = notification.useNotification();
  const [dataSources, setDataSources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchInitialData = async () => {
    try {
      const response = await fetchPlaylistById(1);
      if (response && response.datas) {
        setDataSources(response.datas);
      }
    } catch (err) {
      console.error("Failed to fetch initial playlists:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentBanner = banners[currentIndex];

  const showAlert = (type, title, description) => {
    api[type]({ message: title, description });
  };

  const handleDrawerOpen = () => {
    setIsOpenDrawer(true);
    form.resetFields();
  };

  const onClose = () => {
    setIsOpenDrawer(false);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = form.getFieldsValue();
      const groupId = "1";
      const resp = await addPlaylistToGroup(groupId, values);

      const playlistData = resp?.datas ?? resp;
      if (playlistData && typeof playlistData === 'object' && Object.keys(playlistData).length > 0) {
        showAlert("success", "Sukses", "Playlist berhasil ditambahkan.");
        setDataSources((prev) => [...prev, playlistData]);
        onClose();
      } else {
        showAlert("error", "Gagal", "Gagal menyimpan playlist.");
      }
    } catch (err) {
      console.error("ERROR DURING SUBMIT:", err);
      showAlert("error", "Error", "Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 flex flex-col flex-grow" style={{ gap: 32 }}>
      {contextHolder}

      <div style={{ position: "sticky", top: 0, background: "white", zIndex: 1000, paddingBottom: 16 }}>
        <Row justify="space-between" align="middle" className="mb-4">
          <Title level={1} style={{ margin: 0, paddingLeft: 16, fontWeight: "bold" }}>
            PLAYLISTKU
          </Title>
          <Button
            type="primary"
            icon={<PlusCircleFilled />}
            onClick={handleDrawerOpen}
            style={{ marginRight: 16 }}
          >
            Add Playlist
          </Button>
        </Row>
      </div>

      {/* Auto-rotating Banner */}
      <Row justify="center" style={{ marginBottom: 40 }}>
        <Col xs={24} sm={22} md={20}>
          <Card
            hoverable
            cover={
              <img
                alt={currentBanner.subtitle}
                src={currentBanner.image}
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: 400,
                  borderRadius: 20,
                }}
              />
            }
            style={{ borderRadius: 20, overflow: "hidden" }}
            bodyStyle={{
              padding: 24,
              textAlign: "center",
              background: "#f8f8f8",
            }}
          >
            <Text type="secondary" style={{ marginBottom: 8, color: "#888" }}>
              {currentBanner.subtitle}
            </Text>
            <Title level={3}>{currentBanner.title}</Title>
            <Text>{currentBanner.description}</Text>
          </Card>
        </Col>
      </Row>

      <Row justify="center" style={{ marginBottom: 24 }}>
        <Col xs={24} sm={22} md={20} lg={18}>
          <Input
            size="large"
            placeholder="Looking for something to vibe with? 🎶"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ borderRadius: 8, border: "1px solid #ddd" }}
          />
        </Col>
      </Row>

      {isLoading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <Row gutter={[24, 24]} justify="center">
          {dataSources.filter((item) =>
            item?.play_name?.toLowerCase().includes(searchText.toLowerCase())
          ).map((item) => (
            <Col key={item.id_play} xs={24} sm={12} md={8}>
              <Card
                hoverable
                cover={
                  <img
                    src={item.play_thumbnail}
                    alt={item.play_name}
                    style={{ height: 200, objectFit: "cover", borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
                  />
                }
                style={{ borderRadius: 8, overflow: "hidden" }}
              >
                <Card.Meta
                  title={<b>{item.play_name}</b>}
                  description={
                    <a href={item.play_url} target="_blank" rel="noopener noreferrer">
                      Watch Now
                    </a>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Drawer
        title="Add New Playlist"
        open={isOpenDrawer}
        onClose={onClose}
        width={400}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Play Name"
            name="play_name"
            rules={[{ required: true, message: "Please input play name!" }]}
          >
            <Input placeholder="Enter playlist name" />
          </Form.Item>
          <Form.Item
            label="Play URL"
            name="play_url"
            rules={[{ required: true, message: "Please input play URL!" }]}
          >
            <Input placeholder="https://youtube.com/..." />
          </Form.Item>
          <Form.Item
            label="Play Thumbnail"
            name="play_thumbnail"
            rules={[{ required: true, message: "Please input thumbnail URL!" }]}
          >
            <Input placeholder="https://i.ytimg.com/..." />
          </Form.Item>
          <Form.Item
            label="Play Genre"
            name="play_genre"
            rules={[{ required: true, message: "Please input play genre!" }]}
          >
            <Input placeholder="e.g. J-Pop, Rock" />
          </Form.Item>
          <Form.Item
            label="Play Description"
            name="play_description"
            rules={[{ required: true, message: "Please input description!" }]}
          >
            <Input.TextArea placeholder="Description about this playlist" rows={3} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              loading={isSubmitting}
              onClick={handleSubmit}
              block
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default Playlist;
