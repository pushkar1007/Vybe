import firebaseUserdb from "@/firebase/firebase.userdb";
import { Heading, HStack, Image, Stack, Text } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Comment = ({ comment }) => {
  const [commentUser, setCommentUser] = useState([]);
  const navigate = useNavigate();

  const formattedTime = comment.createdAt
    ? formatDistanceToNow(new Date(Number(comment.createdAt)), { addSuffix: true })
    : "";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const commentUserData = await firebaseUserdb.getUserData(
          comment.createdBy,
        );
        if (commentUserData) setCommentUser(commentUserData);
      } catch (error) {
        console.error("Error fetching comment user:", error);
      }
    };

    fetchUser();
  }, [comment.createdBy]);

  return (
    <HStack
      py={4}
      px={{ base: 1, md: 4 }}
      gap={4}
      borderBottom="1px solid"
      borderColor="brand.500"
      alignItems="start"
    >
      <Image
        src={commentUser.avatar || "/images/profilepic.png"}
        h="50px"
        w="50px"
        alt="profile-picture"
        rounded="full"
        cursor="pointer"
        onClick={() => navigate(`/profile/${commentUser.id}`)}
      />
      <Stack flex={1}>
        <HStack justifyContent="space-between" w="100%">
          <HStack gap={2} maxW="70%">
            <Heading
              fontSize="md"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              _hover={{ textDecoration: "underline" }}
              cursor="pointer"
              onClick={() => navigate(`/profile/${creator.id}`)}
            >
              {commentUser.handlename || "Anonymous"}
            </Heading>
            <Text
              fontSize="sm"
              color="gray.500"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              maxW="130px"
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
              onClick={() => navigate(`/profile/${creator.id}`)}
            >
              @{commentUser.username || "user"}
            </Text>
          </HStack>
          <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
            {formattedTime}
          </Text>
        </HStack>

        <Text fontSize="md" whiteSpace="pre-wrap">
          {comment.content}
        </Text>
      </Stack>
    </HStack>
  );
};

export default Comment;
