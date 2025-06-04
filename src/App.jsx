import { Routes, Route } from "react-router-dom";

import "antd/dist/reset.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import "./assets/styles/adaptive.css";

import LoginPage from "./pages/Login";
import Playlist from "./pages/Playlist";
import Footer from "./components/Footer";  // pastikan path sesuai

function App() {
  return (
    <div className="App" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/playlist" element={<Playlist />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
