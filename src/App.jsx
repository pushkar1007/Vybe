import { HStack } from "@chakra-ui/react";
import Header from "./components/common/Header";
import SideMenu from "./components/common/SideMenu";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Notifications from "./pages/Notifications";
import Explore from "./pages/Explore";
import VyBuds from "./pages/VyBuds";
import VybCircles from "./pages/VybCircles";
import Profile from "./pages/Profile";
import VybeHighlights from "./components/common/VybeHighlights";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Auth from "./pages/Auth";
import { useAuth } from "./context/AuthContext";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

function App() {
  const { user } = useAuth();
  const location = useLocation();

  const hideVybeHighlights = ["/explore"];
  const shouldHideVybeHighlights = hideVybeHighlights.includes(
    location.pathname,
  );

  const isAuthPage = ["/auth", "/signup", "/login"].includes(location.pathname);

  if (user && isAuthPage) {
    return <Navigate to="/" replace />;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/signup" element={<SignUp />} />
        <Route to="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <>
      <Header />
      <HStack
        alignItems="normal"
        justifyContent="space-between"
        h="calc(100vh -115px)"
      >
        <SideMenu />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/explore"
            element={
              <ProtectedRoute>
                <Explore />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vybuds"
            element={
              <ProtectedRoute>
                <VyBuds />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vybcircles"
            element={
              <ProtectedRoute>
                <VybCircles />
              </ProtectedRoute>
            }
          />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        {!shouldHideVybeHighlights && <VybeHighlights />}
      </HStack>
    </>
  );
}

export default App;
