import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KLPSST_Bar from "./Frontend/Components/navbar";
import KLPSST_Page from "./Frontend/Pages/klpsst";
import KLPSST_Login from "./Frontend/Pages/login";
import KLPSST_Register from "./Frontend/Pages/register";
import KLPSST_About from "./Frontend/Pages/about";

const App = () => {
  return (
    <Router>
      <div>
        <KLPSST_Bar />
        <Routes>
          <Route path="/" element={<KLPSST_Login />} />
          <Route path="/home" element={<KLPSST_Page />} />
          <Route path="/login" element={<KLPSST_Login />} />
          <Route path="/register" element={<KLPSST_Register />} />
          <Route path="/about" element={<KLPSST_About />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
