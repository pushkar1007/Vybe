import { HStack } from "@chakra-ui/react";
import Header from "./components/common/Header";
import SideMenu from "./components/common/SideMenu";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Notifications from "./pages/Notifications";
import Explore from "./pages/Explore";
import VyBuds from "./pages/VyBuds";
import VybCircles from "./pages/VybCircles";
import Profile from "./pages/Profile";
import VybeHighlights from "./components/common/VybeHighlights";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Auth from "./pages/Auth";

function App() {

  const location = useLocation();

  const hideVybeHighlights = ["/explore"];
  const shouldHideVybeHighlights = hideVybeHighlights.includes(location.pathname);

  if (!user) {
    return (
      <Routes>
        <Route path="/auth" element={<Auth/>} />
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
          <Route
            path="/profile"
            element={
                <Profile />
              
            }
          />
        </Routes>
        {!shouldHideVybeHighlights && <VybeHighlights />}
      </HStack>
    </>
  );
}

export default App;
