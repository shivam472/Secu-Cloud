import { onAuthStateChanged } from "firebase/auth";
import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { auth } from "../firebase";
import "./App.css";
import { LoginContext } from "./contexts/LoginContext";
import DashboardPage from "./pages/dashboardPage/DashboardPage";
import LoginPage from "./pages/loginPage/LoginPage";
import PrivateRoutes from "./privateRoutes/PrivateRoutes";

function App() {
  const { handleSetIsAuthenticated, handleSetUserData } =
    useContext(LoginContext);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      handleSetIsAuthenticated(true);
      handleSetUserData(user);
    } else {
      handleSetIsAuthenticated(false);
    }
  });

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
