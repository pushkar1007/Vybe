import { Box, HStack } from "@chakra-ui/react";
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
        <Route path="/login" element={<Login />} />
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
        spacing={0}
        w="100%"
        overflow="hidden"
      >
        <Box
          flexShrink={0}
          w={{
            base: "0px", // hidden
            md: "130px", // small sidebar on tablets
            lg: "200px", // normal sidebar
            lgx: "280px", // wide on mid-desktops
            xl: "350px", // full on large desktops
          }}
        >
          <SideMenu />
        </Box>
        <Box flex="1" minW="0" overflow="auto">
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
        </Box>
        {!shouldHideVybeHighlights && (
          <Box
            flexShrink={0}
            w={{
              base: "0px",
              md: "200px",
              lg: "220px",
              lgx: "280px",
              xl: "360px",
            }}
            display={{ base: "none", md: "block" }}
          >
            <VybeHighlights />
          </Box>
        )}
      </HStack>
    </>
  );
}

export default App;
