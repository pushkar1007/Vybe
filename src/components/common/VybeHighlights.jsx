import { Box, Heading, Stack } from "@chakra-ui/react";

const VybeHighlights = () => {
  return (
    <Stack
      bg="brand.500"
      color="white"
      w={{
        base: "0px",
        md: "200px",
        lg: "240px",
        lgx: "280px",
        xl: "360px",
      }}
    
      position="sticky"
      top="115px"
      alignItems="center"
      minH="calc(100vh - 115px)"
      maxH="calc(100vh - 115px)"
      py={4}
      display={{
        base: "none",
        md: "flex",
      }}
      overflowX="hidden"
    >
      <Box
        w="70%"
        h="260px"
        minH="260px"
        border="1px solid white"
        borderRadius="12px"
        p="16px"
        mt="20px"
      >
        <Heading
          fontSize={{
            base: "md",
            md: "lg",
            lg: "xl",
            lgx: "2xl",
            xl: "2xl",
          }}
        >
          Hot Vybes
        </Heading>
      </Box>
      <Box
        w="70%"
        h="260px"
        minH="260px"
        border="1px solid white"
        borderRadius="12px"
        p="16px"
        mt="20px"
      >
        <Heading
          fontSize={{
            base: "md",
            md: "lg",
            lg: "xl",
            lgx: "2xl",
            xl: "2xl",
          }}
        >
          VybeRadar
        </Heading>
      </Box>
    </Stack>
  );
};

export default VybeHighlights;
