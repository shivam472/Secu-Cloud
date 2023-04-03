import { createContext, useState } from "react";

export const LoginContext = createContext({
  isAuthenticated: false,
  userId: "",
});

const LoginContextProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState("");

  const handleSetIsAuthenticated = (authenticationStatus) => {
    setIsAuthenticated(authenticationStatus);
  };
  const handleSetUserData = (data) => {
    setUserData(data);
  };

  const contextObj = {
    isAuthenticated,
    userData,
    handleSetIsAuthenticated,
    handleSetUserData,
  };

  return (
    <LoginContext.Provider value={contextObj}>
      {props.children}
    </LoginContext.Provider>
  );
};

export default LoginContextProvider;
