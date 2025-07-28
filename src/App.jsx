import { Box, HStack, VStack } from "@chakra-ui/react";
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
import Auth from "./pages/auth/Auth";
import { useAuth } from "./context/AuthContext";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import ChatRoom from "./pages/dm/ChatRoom";
import { useEffect } from "react";
import { initPresence } from "./firebase/firebase.presence";
import {PostInterface} from "./components/ui/post/PostInterface";
import { VybeCircleHome } from "./components/ui/vybecircle/VybeCircleHome";
import MigratePosts from "./pages/admin/Migrate";

function App() {
  const { user } = useAuth();
  const location = useLocation();

  const hideVybeHighlights = ["/explore"];
  const hideHeader = ["/vybuds"];
  const shouldHideVybeHighlights = hideVybeHighlights.includes(
    location.pathname,
  );
  const shouldHideHeader = hideHeader.includes(
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
        <Route path="/chat-room" element={<ChatRoom />} />
      </Routes>
    );
  }

  useEffect(() => {
    initPresence();
  }, []);

  return (
    <>
      <VStack h="100vh" gap="0">
        {!shouldHideHeader && <Header />}
        <HStack
          alignItems="start"
          justifyContent="space-between"
          h="full"
          gap={0}
          w="100%"
          overflow="hidden"
        >
          <Box
            flexShrink={0}
            w={{
              base: "0px",
              md: "130px",
              lg: "200px",
              lgx: "280px",
              xl: "350px",
            }}
            display={{
              base: "none",
              md: "block",
            }}
            h="full"
          >
            <SideMenu shouldHideHeader={shouldHideHeader} />
          </Box>
          <Box
            flex="1"
            minW="0"
            h="full"
            overflowY="auto"
            overflowX="hidden"
            css={{
              "&::-webkit-scrollbar": {
                display: "none",
              },
              "&": {
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              },
            }}
          >
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
              <Route path="/vybcircles/:vybecircleId" element={
                  <ProtectedRoute>
                    <VybeCircleHome/>
                  </ProtectedRoute>
                }/>

     <Route path="/admin/migrate" element={
                  <ProtectedRoute>
                    <MigratePosts/>
                  </ProtectedRoute>
                }/>
             

              <Route
                path="/chat-room/:roomId"
                element={
                  <ProtectedRoute>
                    <ChatRoom />
                  </ProtectedRoute>
                }
              />


              <Route
                path="/profile/:uid"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/post/:postId"
                element={
                  <ProtectedRoute>
                    <PostInterface />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<h1>404 - Page Not Found</h1>} />
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
              h="full"
            >
              <VybeHighlights />
            </Box>
          )}
        </HStack>
      </VStack>
    </>
  );
}

export default App;
