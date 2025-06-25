import { Heading, HStack, Icon, Image, Stack, Text } from "@chakra-ui/react";
import { IoMdHeartEmpty } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import { PiShareFat } from "react-icons/pi";

const Post = () => {
  return (
    <HStack
      p={4}
      gap={4}
      borderBottom="1px solid"
      borderColor="brand.500"
      alignItems="start"
    >
      <Image
        src="./images/profilepic.png"
        h="50px"
        w="50px"
        alt="profile-picture"
      />
      <Stack>
        <HStack justify="space-between">
          <HStack gap={0}>
            <Heading
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              maxW={{
                base: "100px",
                md: "135px",
                lg: "170px",
              }}
            >
              user1222222222222222222222222222222222222222222222222222222222222222222
            </Heading>
            <Text
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              maxW={{
                base: "100px",
                md: "135px",
                lg: "170px",
              }}
            >
              @user12345555555555555555555555555555555555555555555555555555555555555555555
            </Text>
          </HStack>
          <Text whiteSpace="nowrap">2h ago</Text>
        </HStack>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam
          explicabo cupiditate libero voluptas qui, tempore perspiciatis debitis
          quas, quod incidunt deleniti aliquam? Porro, neque nam hic incidunt
          corrupti aperiam doloremque.
        </Text>
        <HStack justifyContent="space-between" color="brand.500">
          <HStack gap={1}>
            <Icon as={IoMdHeartEmpty} h="24px" w="24px" cursor="pointer" />
            <Text>1</Text>
          </HStack>
          <HStack gap={1.5}>
            <Icon as={FaRegComment} h="20px" w="20px" cursor="pointer" />
            <Text>1</Text>
          </HStack>
          <HStack gap={1}>
            <Icon as={PiShareFat} h="22px" w="22px" cursor="pointer" />
            <Text>1</Text>
          </HStack>
        </HStack>
      </Stack>
    </HStack>
  );
};

export default Post;
