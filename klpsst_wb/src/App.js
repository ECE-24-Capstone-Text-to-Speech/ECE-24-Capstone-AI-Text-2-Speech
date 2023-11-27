import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import { KLPSST_Page, S3UploadPage } from './Frontend/klpsst';


function App() {
  return (
    <div className = "App">
      <KLPSST_Page name = "hee" />  
      <S3UploadPage name = "haa"/>        
    </div>
    
  );
}

export default App;
