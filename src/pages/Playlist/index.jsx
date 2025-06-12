import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Input,
  Button,
  Form,
  List,
  Drawer,
  notification,
  Row,
  Col,
} from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleFilled,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { getData, sendData } from "../../utils/api";
import TaylorImg from "../../assets/images/taylor.jpeg";
import BillieImg from "../../assets/images/billie.jpeg";
import BrunoImg from "../../assets/images/bruno.jpeg";
import EdImg from "../../assets/images/ed.jpeg";

const { Title, Text } = Typography;

const Playlist = () => {
  const [api, contextHolder] = notification.useNotification();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [currentArtistIndex, setCurrentArtistIndex] = useState(0);

  const artistImages = [
    {
      src: TaylorImg,
      name: "Taylor Swift",
      title: "Listen to trending songs all the time",
      subtitle: "Taylor Swift Midnights",
      description:
        "With Taylor Swift’s. You can get premium music for free anywhere at any time.",
    },
    {
      src: BillieImg,
      name: "Billie Eilish",
      title: "Experience moody melodies",
      subtitle: "Billie Eilish Collection",
      description:
        "Dive into the deep and emotional world of Billie Eilish's music.",
    },
    {
      src: BrunoImg,
      name: "Bruno Mars",
      title: "Funk & Soul Vibes",
      subtitle: "Bruno Mars Hits",
      description: "Enjoy the rhythm and groove with Bruno Mars’ greatest hits.",
    },
    {
      src: EdImg,
      name: "Ed Sheeran",
      title: "Romantic & Acoustic",
      subtitle: "Ed Sheeran Special",
      description:
        "Relax and fall in love with Ed Sheeran’s timeless ballads.",
    },
  ];

  const getYouTubeThumbnail = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/);
    return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : "";
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getData("/api/playlist/41");
      setData(res);
    } catch {
      api.error({ message: "Error", description: "Gagal mengambil data." });
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      const finalValues = { ...values };

      if (!finalValues.play_thumbnail && finalValues.play_url) {
        finalValues.play_thumbnail = getYouTubeThumbnail(finalValues.play_url);
      }

      Object.entries(finalValues).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const url = editingId
        ? `/api/playlist/update/${editingId}`
        : "/api/playlist/41";

      await sendData(url, formData);
      api.success({ message: "Sukses", description: "Data disimpan." });
      fetchData();
      setDrawerOpen(false);
      form.resetFields();
      setEditingId(null);
    } catch {
      api.error({ message: "Gagal", description: "Tidak dapat menyimpan." });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentArtistIndex((i) => (i + 1) % artistImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredData = data.filter((item) =>
    item.play_name.toLowerCase().includes(searchText.toLowerCase())
  );

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
          Playlistku
        </Title>
        <Text style={{ color: "#fff" }}>
          Manage your video playlist list according to your needs.
        </Text>

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
                setEditingId(null);
                setDrawerOpen(true);
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
              textShadow: "0 2px 6px rgba(0,0,0,0.6)",
            }}
          >
            <Title level={3} style={{ color: "white" }}>
              {artistImages[currentArtistIndex].title}
            </Title>
            <Text strong style={{ color: "white", fontSize: 18 }}>
              {artistImages[currentArtistIndex].subtitle}
            </Text>
            <br />
            <Text style={{ color: "white" }}>
              {artistImages[currentArtistIndex].description}
            </Text>
          </div>
        </div>
      </div>

      {/* List Playlist */}
      <List
        loading={loading}
        grid={{ gutter: 16, column: 3 }}
        dataSource={filteredData}
        renderItem={(item) => (
          <List.Item>
            <Card
              hoverable
              cover={
                <img
                  alt="thumbnail"
                  src={
                    item.play_thumbnail || getYouTubeThumbnail(item.play_url)
                  }
                  style={{ height: 200, objectFit: "cover" }}
                />
              }
              actions={[
                <Button
                  type="link"
                  href={item.play_url}
                  target="_blank"
                  icon={<PlayCircleOutlined />}
                />,
                <EditOutlined
                  style={{ color: "#ccc", cursor: "not-allowed" }}
                />,
                <DeleteOutlined
                  style={{ color: "#ccc", cursor: "not-allowed" }}
                />,
              ]}
            >
              <Title level={5}>{item.play_name}</Title>
              <Text type="secondary">
                Genre: {item.play_genre || "-"}
              </Text>
              <br />
              <Text>{item.play_description}</Text>
            </Card>
          </List.Item>
        )}
      />

      {/* Drawer Form */}
      <Drawer
        title={editingId ? "Edit Playlist" : "Tambah Playlist"}
        open={drawerOpen}
        onClose={() => {
          form.resetFields();
          setDrawerOpen(false);
          setEditingId(null);
        }}
        width={400}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            name="play_name"
            label="Nama"
            rules={[{ required: true }]}
          >
            <Input placeholder="Nama Playlist" />
          </Form.Item>
          <Form.Item
            name="play_url"
            label="URL Video"
            rules={[{ required: true }]}
          >
            <Input placeholder="Contoh: https://..." />
          </Form.Item>
          <Form.Item name="play_thumbnail" label="Thumbnail (Opsional)">
            <Input placeholder="Kosongkan untuk otomatis dari YouTube" />
          </Form.Item>
          <Form.Item
            name="play_genre"
            label="Genre"
            rules={[{ required: true }]}
          >
            <Input placeholder="Contoh: Musik, Edukasi" />
          </Form.Item>
          <Form.Item name="play_description" label="Deskripsi">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default Playlist;
