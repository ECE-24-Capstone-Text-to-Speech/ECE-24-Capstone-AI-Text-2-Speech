import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom'
import KLPSST_Page from './Frontend/klpsst.js';
import KLPSST_Login from './Frontend/login.js';
import KLPSST_Bar from './Frontend/navbar.js';

const App = () => {
  return (
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
        </Routes>
      </div>
    </Router>
  );
};

export default App;


