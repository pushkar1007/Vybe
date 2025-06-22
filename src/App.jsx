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

function App() {

  const location = useLocation();

  const hideVybeHighlights = ["/explore"];
  const shouldHideVybeHighlights = hideVybeHighlights.includes(location.pathname);

  return (
    <>
      <Header />
      <HStack alignItems="normal" justifyContent="space-between" h="calc(100vh -115px)"> 
        <SideMenu  />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/vybuds" element={<VyBuds />} />
          <Route path="/vybcircles" element={<VybCircles />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        {!shouldHideVybeHighlights && <VybeHighlights/>}
      </HStack>
    </>
  );
}

export default App;
