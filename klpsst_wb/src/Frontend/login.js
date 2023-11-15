import React, {useState} from "react";
// import styled from "styled-components";
import "./login.css";
import { Navigate, redirect } from "react-router-dom";
import KLPSSTLOGO from "./logo_image.png"
// import { routeManager } from "../../routeManager";
import { render } from "@testing-library/react";

const KLPSST_Login = ({}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        //per god:
        // Add your login logic here, such as sending a request to your backend
        console.log("Login submitted with:", { username, password });

        try {
            const response = await fetch('http://localhost:80/register', {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ username, password }),
            });
            // return response.json();
      
            if (response.ok) {
              // Authentication successful, handle accordingly (e.g., redirect user)
              console.log("Login successful");
            } else {
              // Authentication failed, handle accordingly (e.g., show error message)
              console.error("Login failed");
            }
          } catch (error) {
            console.error("Error:", error);
          }

        // try{
            
        //     console.log(
        //       "name=" +
        //         username +
        //         ", id=" +
        //         userID +
        //         ", password=" +
        //         password +
        //         ", re-typed=" +
        //         repassword
        //     );
        //     var message: string = "Waiting for server...";
        //     var status: boolean = true;
        //     var url: string = "/api/register";
        //     var formData = new FormData();
        //     formData.append("username", username);
        //     formData.append("userID", userID);
        //     formData.append("password", password);
        //     setShowAlert(true);
        //     setAlertMessage({ message: message });
        
        //     fetch(url, { body: formData, method: "post" })
        //       .then((response) => {
        //         return response.json();
        //       })
        //       .then((data: API_REGISTRATION_RESULT) => {
        //         status = data.registrationSuccess;
        //         message = data.message;
        //         console.log(
        //           "registration success: " + status + ". Message: " + message
        //         );
        //         setAlertMessage({ success: status, message: message });
        //       });
        // }
    };

    return (
        <div id = "login">
            <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                        required
                    />
                    </label>
                    <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                    </label>
                    <button type="submit">Login</button>
                </form>

            {/* <form>
                <input type="text" id="username" name="username" placeholder="type in your username"/>

            </form> */}
        </div>

        // <form>
        //         {/* <label for="userInput">Type a sentence:</label>
        //         <input type="text" id="userInput" name="userInput" placeholder="sentence" required> <input />
                
        //         <input type="submit" value="Done"> <input /> */}
        //         <label for="userInput" style={{textAlign:"left"}}>Type a sentence:</label>
        //         <input type="text" id="userInput" name="userInput" placeholder="sentence"
        //             value={inputValue} // Bind the input's value to the state variable
        //             onChange={handleInputChange} // Call the event handler when the input changes
        //         />
        //         <p>You typed: {inputValue}</p>
        //         <input type="submit" value="Done"></input>
        //     </form>
    );
}

export default KLPSST_Login;