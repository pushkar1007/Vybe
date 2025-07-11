import { Box, Heading, HStack, Icon } from "@chakra-ui/react";
import Search from "../Search";
import { LuSearch } from "react-icons/lu";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const VyBudsHeader = () => {

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  }

  return (
    <HStack w="full" borderBottom="1px solid" borderColor="brand.500" gap={0}>
      <Box m={4} alignSelf="start" display={{
        base: "block",
        md: "none",
      }}>
        <Icon as={FaArrowLeftLong} boxSize="20px" color="brand.200" cursor="pointer" onClick={handleClick} />
      </Box>
      <HStack
        mx={2}
        px={2}
        justifyContent="space-between"
        h="100px"
        w="full"
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
    </HStack>
  );
};

export default VyBudsHeader;
