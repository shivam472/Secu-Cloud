import { createContext, useState } from "react";

export const LoginContext = createContext({
  isAuthenticated: false,
  userId: "",
  secretKey: "",
});

const LoginContextProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState("");
  const [secretKey, setSecretKey] = useState("");

  const handleSetIsAuthenticated = (authenticationStatus) => {
    setIsAuthenticated(authenticationStatus);
  };
  const handleSetUserData = (data) => {
    setUserData(data);
  };
  const handleSetSecretKey = (data) => {
    setSecretKey(data);
  };

  const contextObj = {
    isAuthenticated,
    userData,
    secretKey,
    handleSetIsAuthenticated,
    handleSetUserData,
    handleSetSecretKey,
  };

  return (
    <LoginContext.Provider value={contextObj}>
      {props.children}
    </LoginContext.Provider>
  );
};

export default LoginContextProvider;
