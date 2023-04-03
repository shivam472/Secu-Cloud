import { createContext, useState } from "react";

export const LoginContext = createContext({
  isAuthenticated: false,
  userId: "",
});

const LoginContextProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState("");

  const handleSetIsAuthenticated = (authenticationStatus) => {
    setIsAuthenticated(authenticationStatus);
  };
  const handleSetUserId = (userId) => {
    setUserId(userId);
  };

  const contextObj = {
    isAuthenticated,
    userId,
    handleSetIsAuthenticated,
    handleSetUserId,
  };

  return (
    <LoginContext.Provider value={contextObj}>
      {props.children}
    </LoginContext.Provider>
  );
};

export default LoginContextProvider;
