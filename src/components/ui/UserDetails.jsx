import ProfileIcon from "@/components/icons/ProfileIcon";
import {
  Box,
  Heading,
  HStack,
  Icon,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import SpinnerBtn from "./SpinnerBtn";
import { useAuth } from "@/context/AuthContext";

const UserDeatils = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  const { user } = useAuth();

  return (
    <Stack position="relative" gap={0}>
      <HStack
        borderBottom="1px solid"
        borderColor="brand.500"
        h="70px"
        alignItems="flex-start"
        px={4}
        py={3}
        gap={4}
      >
        <Icon
          as={FaArrowLeftLong}
          color="brand.500"
          my={1}
          onClick={handleClick}
          cursor="pointer"
        />
        <Stack gap={0} m={0}>
          <Heading m={0}>{user?.displayName || "Unknown User"}</Heading>
          <Text fontSize="sm">12 Posts</Text>
        </Stack>
      </HStack>
      {/* <Image bg="brand.100" w="full" /> */}
      <Box
        bg="brand.300"
        w="full"
        h="160px"
        borderBottom="1px solid"
        borderColor="brand.500"
      ></Box>
      <Box
        border="1px solid #000000"
        rounded="full"
        h="100px"
        w="100px"
        position="absolute"
        bg="brand.400"
        top="180px"
        left="20px"
      >
        {user?.photoURL ? (
          <Image src={user.photoURL} alt="Profile" boxSize="100px" />
        ) : (
          <Image as={ProfileIcon} />
        )}
      </Box>
      <HStack
        borderBottom="1px solid"
        borderColor="brand.500"
        justifyContent="space-between"
        p={4}
      >
        <Stack mt="50px" gap="10px">
          <Stack gap={0}>
            <Heading>{user?.displayName || "Unknown User"}</Heading>
            <Text color="brand.100" lineHeight={1}>
              @{user?.email?.split("@")[0] || "user"}
            </Text>
          </Stack>
          <Text>Description.....</Text>
        </Stack>
        <SpinnerBtn
          text="Edit Profile"
          border="1px solid #EF5D60"
          rounded="full"
        />
      </HStack>
    </Stack>
  );
};

export default UserDeatils;
