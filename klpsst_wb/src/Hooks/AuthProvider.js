import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({
  auth: null,
  setAuth: () => {},
  user: null,
});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);

  const isAuth = async () => {
    console.log("Checking log in status...");
    try {
      const token = sessionStorage.getItem("token");
      fetch(process.env.REACT_APP_SERVER_ADDRESS + "/users/loginStatus", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          if (json.loggedIn) {
            console.log("current user logged in: " + json.username);
            setUser(json.username);
            setAuth(true);
          } else {
            console.warn("NO USER LOGGED IN!");
            setUser(null);
            setAuth(false);
          }
        });
    } catch (error) {
      console.error("Error:", error);
      setUser(null);
      setAuth(false);
    }
  };

  useEffect(() => {
    isAuth();
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
