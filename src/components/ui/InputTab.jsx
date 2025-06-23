import { Input, InputGroup } from "@chakra-ui/react";

export const InputTab = ({startElement, ...props}) => {
  return (
    <>
      <InputGroup flex="1" startElement={startElement}>
        <Input
          variant="unstyled"
          color="white"
          _placeholder={{ color: "whiteAlpha.600", fontWeight: "normal" }}
          fontSize="lg"
          fontWeight="normal"
          border="1px solid white"
          borderRadius="xl"
          bg="whiteAlpha.300"
          px={4}
          py={2}
          {...props}
        />
      </InputGroup>
    </>
  );
};

export default InputTab;