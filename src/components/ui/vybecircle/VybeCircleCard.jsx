import { useAuth } from "@/context/AuthContext";
import firebaseVybecirclesdb from "@/firebase/firebase.vybecirclesdb";
import firebaseUserdb from "@/firebase/firebase.userdb";
import { Box, Text, Image, Button, Icon } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCrown } from "react-icons/fa";
import { IoExitOutline } from "react-icons/io5";

//this is a card format of a vybecircle

export const VybeCircleCard = ({ VybeCircleId }) => {
  const { user } = useAuth();
  const [circleData, setCircleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  async function fetchCircleData() {
    try {
      const fetchedData =
        await firebaseVybecirclesdb.getVybecircle(VybeCircleId);
      if (fetchedData) {
        setCircleData(fetchedData);
      }
    } catch (error) {
      console.error("Error fetching vybecircle data", error);
    } finally {
      setLoading(false);
    }
  }

  const handleExit = async () => {
    try {
      await firebaseVybecirclesdb.removeUser(user.uid, VybeCircleId);
      await firebaseUserdb.removeVybeCircle(VybeCircleId, user);
      console.log("exited successfully");
    } catch (error) {
      console.error("error removing user ", error);
    }
  };

  useEffect(() => {
    fetchCircleData();
  }, []);

  return (
    <Box
      height="250px"
      w="250px"
      rounded="14px"
      overflow="hidden"
      boxShadow="sm"
      border="1px solid #ed1c5b"
      display="flex"
      flexDirection="column"
    >
      {/* Header: 30% */}
      <Box
        bgImage={`url(${
          circleData?.banner ||
          "https://res.cloudinary.com/dw1ikwae9/image/upload/v1753372126/vybcricle_banner_uevbiz.png"
        })`}
        h="25%"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        borderTopRadius="12px"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={4}
      >
        <Image
          src={circleData?.logo || "#"}
          boxSize="40px"
          borderRadius="full"
          border="1px solid white"
          bg="white"
        />
        {circleData?.createdBy == user.uid ? <Icon as={FaCrown} /> : null}
      </Box>

      {/* Body: 70% */}
      <Box h="70%" p={4} display="flex" flexDirection="column">
        <Text
          cursor={"pointer"}
          onClick={() => {
            navigate(`/vybcircles/${VybeCircleId}`);
          }}
          fontWeight="bold"
          fontSize="md"
        >
          {circleData?.name || "Name"}
        </Text>
        <Text fontSize="sm" color="gray.600" mt={1}>
          {circleData?.description ||
            "a basic description about the vybcircle short and simple"}
        </Text>

        {/* Push the button to the bottom-right */}

        <Icon
          as={IoExitOutline}
          onClick={handleExit}
          size="lg"
          mt="auto"
          alignSelf="end"
        />
      </Box>
    </Box>
  );
};
