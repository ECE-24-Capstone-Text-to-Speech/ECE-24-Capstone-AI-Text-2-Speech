import logo from './logo.svg';
import './App.css';
import { KLPSST_Page, S3UploadPage } from './Frontend/klpsst';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom'
import KLPSST_Page from './Frontend/klpsst.js';
import KLPSST_Login from './Frontend/login.js';
import KLPSST_Bar from './Frontend/navbar.js';
import KLPSST_Register from './Frontend/register.js';

const App = () => {
  return (
    <div className = "App">
      <KLPSST_Page name = "hee" />  
      <S3UploadPage name = "haa"/>        
    </div>
    <Router>
      <div>
        <KLPSST_Bar />
        {/* <nav>
          <ul>
            <li>
              <Link to="/">KLPSST_Page</Link>
            </li>
            <li>
              <Link to="/login">KLPSST_Login</Link>
            </li>
          </ul>
        </nav> */}

        <Routes>
          <Route path="/" element={<KLPSST_Page />} />
          <Route path="/home" element={<KLPSST_Page />} />
          <Route path="/login" element={<KLPSST_Login />} />
          <Route path="/register" element={<KLPSST_Register />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;


