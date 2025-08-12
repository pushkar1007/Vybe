import { Input, InputGroup, Stack } from "@chakra-ui/react";

export const InputTab = ({startElement, ...props}) => {
  return (
    <Stack w="100%">
      <InputGroup flex="1" startElement={startElement}>
        <Input
          variant="unstyled"
          color="white"
          _placeholder={{ color: "whiteAlpha.600", fontWeight: "normal" }}
          fontSize={{
            base: "sm",
            md: "md",
            lg: "lg",
          }}
          fontWeight="normal"
          border="1px solid white"
          borderRadius="xl"
          bg="whiteAlpha.300"
          px={4}
          py={2}
          {...props}
        />
      </InputGroup>
    </Stack>
  );
};

export default InputTab;