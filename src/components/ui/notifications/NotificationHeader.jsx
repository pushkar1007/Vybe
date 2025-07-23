import { Heading, HStack, Icon } from "@chakra-ui/react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const NotificationHeader = () => {
  const navigate = useNavigate();
  return (
    <HStack
      p={4}
      gap={6}
      alignItems="center"
      h="50px"
      bg="brand.400"
      borderBottom="1px solid"
      borderColor="brand.500"
      position="sticky"
      top="0"
      zIndex="1000"
    >
      <Icon
        as={FaArrowLeftLong}
        color="brand.500"
        my={1}
        onClick={() => navigate(-1)}
        cursor="pointer"
      />
      <Heading>Notifications</Heading>
    </HStack>
  );
};

export default NotificationHeader;
