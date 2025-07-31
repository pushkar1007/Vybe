import { useAuth } from "@/context/AuthContext";
import firebaseVybecirclesdb from "@/firebase/firebase.vybecirclesdb";
import firebaseUserdb from "@/firebase/firebase.userdb";
import { Box, Text, Image, Button, Icon } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCrown } from "react-icons/fa";
import { IoExitOutline } from "react-icons/io5";

export const VybeCircleCard = ({ VybeCircleId }) => {
  const { user, refreshUser } = useAuth();
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
      await refreshUser();
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
      cursor="pointer"
      onClick={() => {
        navigate(`/vybcircles/${VybeCircleId}`);
      }}
    >
      <Box
        bgImage={`url(${
          circleData?.banner ||
          `${process.env.VITE_CLOUDINARY_URL}/v1753372126/vybcricle_banner_uevbiz.png`
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
        {circleData?.createdBy == user.uid ? (
          <Icon color="yellow.600" boxSize={5} as={FaCrown} />
        ) : null}
      </Box>

      <Box h="70%" p={4} display="flex" flexDirection="column">
        <Text cursor={"pointer"} fontWeight="bold" fontSize="md">
          {circleData?.name || "Name"}
        </Text>
        <Text fontSize="sm" color="gray.600" mt={1}>
          {circleData?.description ||
            "a basic description about the vybcircle short and simple"}
        </Text>

        <Icon
          as={IoExitOutline}
          onClick={(e) => {
            e.stopPropagation();
            handleExit();
          }}
          size="lg"
          mt="auto"
          alignSelf="end"
          cursor="pointer"
        />
      </Box>
    </Box>
  );
};
