import { Box, Heading, Stack } from "@chakra-ui/react";

const VybeHighlights = () => {
  return (
    <Stack
      bg="brand.500"
      color="white"
      w="400px"
      position="sticky"
      top="115px"
      alignItems="center"
      minH="calc(100vh - 115px)"
      maxH="calc(100vh - 115px)"
      py={4}
      overflow="auto"
    >
      <Box
        w="250px"
        h="300px"
        border="1px solid white"
        borderRadius="12px"
        p="16px"
        mt="20px"
      >
        <Heading>Hot Vybes</Heading>
      </Box>
      <Box
        w="250px"
        h="300px"
        border="1px solid white"
        borderRadius="12px"
        p="16px"
        mt="20px"
      >
        <Heading>VybeRadar</Heading>
      </Box>
    </Stack>
  );
};

export default VybeHighlights;
