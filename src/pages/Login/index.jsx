import { Layout, Button, Row, Col, Typography, Form, Input } from "antd";
import LogoImage from "../../assets/images/Logo_Playlist.png";
import "./login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Header, Footer, Content } = Layout;

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log(username, password);
    navigate("/playlist", { replace: true });
  };

  return (
    <Layout className="layout-default layout-signin">
      <Header
        style={{
          background: "linear-gradient(to right, #243B55, #141E30)",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div className="header-col header-brand">
          <h1 style={{ color: "white", fontWeight: "bold", margin: 0 }}>
            🎧 DARURAT <span style={{ color: "#00C8FF" }}>TEAM</span>
          </h1>
        </div>
      </Header>

      <Content className="signin login-container">
        <Row gutter={[24, 0]} justify="space-around" align="middle" style={{ minHeight: "80vh" }}>
          <Col
            className="sign-img"
            xs={{ span: 24 }}
            lg={{ span: 8, offset: 2 }}
            md={{ span: 10 }}
            style={{ textAlign: "center" }}
          >
            <img
              src={LogoImage}
              alt="Login Logo"
              style={{
                width: "100%",
                maxWidth: 300,
                borderRadius: 20,
                marginTop: 60,
                boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
              }}
            />
          </Col>
          <Col xs={{ span: 24 }} lg={{ span: 8 }} md={{ span: 12 }}>
            <Title className="mb-15">Sign In</Title>
            <Title className="font-regular text-muted" level={5}>
              Enter your email and password to sign in
            </Title>
            <Form onFinish={handleLogin} layout="vertical" className="row-col">
              <Form.Item
                className="username"
                label="Email"
                name="email"
                rules={[{ required: true, message: "Please input your email!" }]}
              >
                <Input
                  placeholder="Email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                className="password"
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please input your password!" }]}
              >
                <Input.Password
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                  disabled={!username || !password}
                >
                  SIGN IN
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Content>

    </Layout>
  );
};

export default LoginPage;
