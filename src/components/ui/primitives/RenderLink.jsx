import { HStack, Icon, Text } from "@chakra-ui/react";

const RenderLink = ({ text, icon }) => {
  return (
    <HStack
      key={text}
      px="4"
      css={{
        "@media (max-height: 650px)": {
          marginY: "10px",
        },
        "@media (min-height: 651px)": {
          marginY: "20px",
        },
      }}
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
      <Icon
        as={icon}
        h={{
          base: "20px",
          md: "30px",
          lg: "20px",
        }}
        w={{
          base: "20px",
          md: "30px",
          lg: "20px",
        }}
        color="brand.400"
      />
      <Text
        fontSize="20px"
        fontWeight="medium"
        color="brand.400"
        display={{
          base: "block",
          md: "none",
          lg: "block",
        }}
      >
        {text}
      </Text>
    </HStack>
  );
};

export default RenderLink;
