import React, { useState, useEffect } from "react";
import {
  Typography,
  notification,
  Card,
  Row,
  Col,
  Skeleton,
} from "antd";

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
    description:
      "With Taylor Swift’s. You can get premium music for free anywhere at any time.",
  },
  {
    image: BillieImg,
    title: "Experience moody melodies",
    subtitle: "Billie Eilish Collection",
    description:
      "Dive into the deep and emotional world of Billie Eilish's music.",
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      api.info({
        message: "Welcome to Playlistku",
        description: "Enjoy curated music banners updated regularly.",
        duration: 2,
      });
    }, 1000);

    return () => clearTimeout(loadingTimer);
  }, [api]);

  useEffect(() => {
    if (isLoading) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col flex-grow">
        <Row justify="start" className="mb-6">
          <Title level={1} style={{ margin: 0, paddingLeft: 16 , fontWeight: "bold"}}>
            PLAYLISTKU
          </Title>
        </Row>
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="p-6 flex flex-col flex-grow" style={{ gap: 32 }}>
      {contextHolder}

      <Row justify="start" className="mb-6">
        <Title level={1} style={{ margin: 0, paddingLeft: 16 , fontWeight: "bold"}}>
          PLAYLISTKU
        </Title>
      </Row>

      <Row justify="center" align="middle" style={{ flexGrow: 1 }}>
        <Col span={24} style={{ position: "relative" }}>
          <Card
            hoverable
            cover={
              <img
                alt={currentBanner.subtitle}
                src={currentBanner.image}
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: 500,
                  borderRadius: 24,
                }}
              />
            }
            style={{ borderRadius: 24, overflow: "hidden", padding: 16 }}
            bodyStyle={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 24,
              padding: 24,
              textAlign: "center",
            }}
            bordered={false}
          >
            <Text type="secondary" style={{ marginBottom: 8, color: "#ddd" }}>
              {currentBanner.subtitle}
            </Text>
            <Title level={2} style={{ marginBottom: 12, color: "white" }}>
              {currentBanner.title}
            </Title>
            <Text style={{ marginBottom: 24, color: "white" }}>
              {currentBanner.description}
            </Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Playlist;
