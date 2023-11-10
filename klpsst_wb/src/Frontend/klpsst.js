import React, {useState} from "react";
// import styled from "styled-components";
import "./klpsst.css";
import { Navigate, redirect } from "react-router-dom";
import KLPSSTLOGO from "./logo_image.png"
// import { routeManager } from "../../routeManager";
import { render } from "@testing-library/react";

const KLPSST_Page = ({}) => {

    // Define a state variable to store the input's value
  const [inputValue, setInputValue] = useState('');

  // Create an event handler function to update the input value
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };


    return (
        <div id = "homepage">
            <h1>KLPSST</h1>
            <img src={KLPSSTLOGO} alt="logo" style={{width: '168px', height: '168px'}}/>
            <form>
                {/* <label for="userInput">Type a sentence:</label>
                <input type="text" id="userInput" name="userInput" placeholder="sentence" required> <input />
                
                <input type="submit" value="Done"> <input /> */}
                <label for="userInput" style={{textAlign:"left"}}>Type a sentence:</label>
                <input type="text" id="userInput" name="userInput" placeholder="sentence"
                    value={inputValue} // Bind the input's value to the state variable
                    onChange={handleInputChange} // Call the event handler when the input changes
                />
                <p>You typed: {inputValue}</p>
                <input type="submit" value="Done"></input>
            </form>

            <h3>Please submit 2 .wav or .mp3 files, each about 6 seconds long</h3>

            <input type="file" id="fileInput"/>
    
            <button onclick="uploadFile()">Upload File</button> 


            <input type="file" id="fileInput1" />
    
            <button onclick="uploadFile()">Upload File</button>
    
            <p id="fileName"></p>
        </div>
    );
}

export default KLPSST_Page;