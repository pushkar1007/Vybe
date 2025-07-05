import { Box, Heading, HStack, Icon, Image, Stack } from "@chakra-ui/react";
import { IoIosArrowBack } from "react-icons/io";
import ProfileIcon from "../icons/ProfileIcon";

const ChatHeader = ({ chatPartnerData, presence }) => {
    
    const formatLastSeen = (timestamp) => {
        if (!timestamp) return "Unknown";
        const date = new Date(timestamp);
        const secondsAgo = Math.floor((Date.now() - date.getTime()) / 1000);
    
        if (secondsAgo < 60) return "Just now";
        if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} min ago`;
        if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} hr ago`;
        return `${Math.floor(secondsAgo / 86400)} day(s) ago`;
      };

    return (
      <HStack
        p={4}
        gap={6}
        align="center"
        borderBottom="1px solid"
        borderColor="brand.500"
      >
        <Icon as={IoIosArrowBack} boxSize={6} />
        {chatPartnerData.avatar ? (
          <Image
            src={chatPartnerData.avatar}
            alt="Profile"
            boxSize="50px"
            rounded="full"
          />
        ) : (
          <Box boxSize="50px" rounded="full" border="1px solid black">
            <Image
              as={ProfileIcon}
              alt="Profile"
              boxSize="50px"
              rounded="full"
            />
          </Box>
        )}
        <Stack gap={0} justifyContent="center" h="50px">
          <Heading size="md">{chatPartnerData.handlename}</Heading>
          <HStack align="center">
            <Box
              boxSize="10px"
              borderRadius="full"
              bg={presence.online ? "green.400" : "gray.400"}
            />
            <Box
              fontSize="sm"
              color={presence.online ? "green.600" : "gray.600"}
            >
              {presence.online
                ? "Online"
                : presence.lastSeen
                  ? `Last seen ${formatLastSeen(presence.lastSeen)}`
                  : "Offline"}
            </Box>
          </HStack>
        </Stack>
      </HStack>
    );
}

export default ChatHeader