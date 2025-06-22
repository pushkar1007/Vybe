import { Input, InputGroup } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";

export const SearchTab = () => {
  return (
    <>
      <InputGroup flex="1" startElement={<LuSearch color="white" size="18px"/>}>
        <Input
          variant="unstyled"
          placeholder="Wanna Vybe?"
          color="white"
          _placeholder={{ color: "whiteAlpha.600", fontWeight: "normal" }}
          fontSize="lg"
          fontWeight="normal"
          border="1px solid white"
          borderRadius="xl"
          bg="whiteAlpha.300"
          px={4}
          py={2}
          w="fit-content"
          maxW="260px"
        />
      </InputGroup>
    </>
  );
};

export default SearchTab;