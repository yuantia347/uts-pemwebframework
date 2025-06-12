import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import Playlist from "./pages/Playlist";
import Footer from "./components/Footer";

function App() {
  return (
    <div
      className="App"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Konten utama */}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/playlist" element={<Playlist />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </div>

      {/* Footer di tengah */}
      <div style={{ textAlign: "center", padding: "16px 0" }}>
        <Footer />
      </div>
    </div>
  );
}

export default App;
