import { HStack, Icon, Text } from "@chakra-ui/react";

const RenderLink = ({ text, icon }) => {
  return (
    <HStack
      key={text}
      px="4"
      my="5"
      border="1px solid transparent"
      h="40px"
      _hover={{
        bg: "whiteAlpha.300",
        border: "1px solid white",
      }}
      color="brand.100"
      rounded="full"
      lineHeight="0"
      alignItems="center"
      cursor="pointer"
    >
      <Icon as={icon} h="20px" w="20px" color="brand.400" />
      <Text
        fontSize="20px"
        fontWeight="medium"
        color="brand.400"
      >
        {text}
      </Text>
    </HStack>
  );
};

export default RenderLink;
