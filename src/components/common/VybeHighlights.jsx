import { Box, Heading, Stack } from "@chakra-ui/react";

const VybeHighlights = () => {
    return (
      <Stack bg="brand.500" color="white" w="272px" alignItems="center">
        <Box
          w="206px"
          h="238px"
          border="1px solid white"
          borderRadius="12px"
          p="16px"
          mt="20px"
        >
          <Heading>Hot Vybes</Heading>
        </Box>
        <Box
          w="206px"
          h="238px"
          border="1px solid white"
          borderRadius="12px"
          p="16px"
          mt="20px"
        >
          <Heading>VybeRadar</Heading>
        </Box>
      </Stack>
    );
}

export default VybeHighlights;