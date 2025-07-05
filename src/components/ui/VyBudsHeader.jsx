import { Heading, HStack } from "@chakra-ui/react";
import Search from "./Search";
import { LuSearch } from "react-icons/lu";

const VyBudsHeader = () => {
  return (
    <HStack
      mx={4}
      px={2}
      justifyContent="space-between"
      borderBottom="1px solid"
      borderColor="brand.500"
      h="100px"
      display="flex"
      alignItems="center"
    >
      <Heading fontSize="24px" fontWeight="700">
        VyBuds
      </Heading>
      <Search
        border="1px solid #EF5D60"
        _placeholder={{
          color: "#EF5D60",
        }}
        color="brand.500"
        startElement={<LuSearch color="#EF5D60" size="18px" />}
        placeholder="Search VyBud"
      />
    </HStack>
  );
};

export default VyBudsHeader;
