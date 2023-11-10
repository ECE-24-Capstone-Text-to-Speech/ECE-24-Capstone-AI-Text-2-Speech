import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import KLPSST_Page from './Frontend/klpsst.js';

function App() {
  return (
    <div className = "App">
      <KLPSST_Page name = "hee" />          
    </div>
  );
}

export default App;
