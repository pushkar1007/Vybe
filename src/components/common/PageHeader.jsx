import { Heading, HStack, Icon, Stack, Text } from "@chakra-ui/react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const PageHeader = ({ page,data }) => {
  const navigate = useNavigate();
  return (
    <>
      <HStack
        p={4}
        gap={6}
        alignItems="center"
        h={page == "profile" ? "70px" : "50px"}
        bg="brand.400"
        borderBottom="1px solid"
        borderColor="brand.500"
        position="sticky"
        top="0"
        zIndex="1000"
      >
        {page == "Comments" ? null : (
          <Icon
            as={FaArrowLeftLong}
            color="brand.500"
            my={1}
            onClick={() => navigate(-1)}
            cursor="pointer"
          />
        )}
        <Stack gap={0}>
          <Heading>{page == "profile" ? data?.handlename : page}</Heading>
          {page == "profile" ? (
            <Text fontSize="sm">
              {data?.createdPosts?.length ?? 0} Post
              {data?.createdPosts?.length === 1 ? "" : "s"}
            </Text>
          ) : null}
        </Stack>
      </HStack>
    </>
  );
};

export default PageHeader;
