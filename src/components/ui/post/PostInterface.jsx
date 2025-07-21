import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import firebasePostdb from "@/firebase/firebase.postdb";
import { useAuth } from "@/context/AuthContext";
import Post from "./Post";
import CommentsList from "./CommentsList";
import { Box, Heading, HStack, Icon, Input, Stack } from "@chakra-ui/react";
import { FaArrowLeftLong } from "react-icons/fa6";
import EmojiPicker from "emoji-picker-react";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { FiSend } from "react-icons/fi";
import { isEqual } from "lodash";
import firebaseCommentsdb from "@/firebase/firebase.commentsdb";


export const PostInterface = () => {
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState(null);
  const [myComment, setMyComment] = useState(null);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null);
  const { postId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const addCommentToPost = async (postId, commentId) => {
    try {
      await firebasePostdb.addComment(postId, commentId);
      const updatedPost = await firebasePostdb.getPostData(postId);
      setPost(updatedPost);
    } catch (error) {
      console.log("error adding comment to post", error);
    }
  };

  const getComments = async (cref) => {
    if (!cref || cref.length === 0) {
      setComments([]);
      return;
    }

    try {
      const commentPromises = cref.map((ref) =>
        firebaseCommentsdb.getComment(ref.id),
      );

      const fetchedComments = await Promise.all(commentPromises);
      const filteredComments = fetchedComments.filter(Boolean);

      setComments((prev) =>
        !isEqual(filteredComments, prev) ? filteredComments : prev,
      );
    } catch (error) {
      console.log("Error fetching comments:", error);
      setComments([]);
    }
  };

  const addComment = async () => {
    try {
      const comment = await firebaseCommentsdb.createComment(
        inputRef.current.value,
        user.uid,
      );
      await addCommentToPost(postId, comment.id);
      await getComments(post?.comments);
      setMyComment("");
      setShowEmojiPicker(false);
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleKeyDown = async (e) => {
    try {
      if (e.key === "Enter") await addComment();
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    const cursorPos = inputRef.current.selectionStart;
    const text = myComment;
    const newText = text.slice(0, cursorPos) + emoji + text.slice(cursorPos);
    setMyComment(newText);

    setTimeout(() => {
      inputRef.current.focus();
      inputRef.current.selectionEnd = cursorPos + emoji.length;
    }, 0);
  };

  useEffect(() => {
    (async () => {
      try {
        await getComments(post?.comments);
        setCommentsLoading(false);
      } catch (error) {
        console.log("Error fetching comments: ", error);
      }
    })();
  }, [post?.comments]);

  useEffect(() => {
    (async () => {
      try {
        const postData = await firebasePostdb.getPostData(postId);
        setPost(postData);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching post: ", error);
      }
    })();
  }, []);

  return loading ? (
    <>Loading....</>
  ) : (
    <Stack gap={0} h="100%">
      <HStack
        p={4}
        gap={6}
        alignItems="center"
        h="50px"
        bg="brand.400"
        borderBottom="1px solid"
        borderColor="brand.500"
        position="sticky"
        top="0"
        zIndex="1000"
      >
        <Icon
          as={FaArrowLeftLong}
          color="brand.500"
          my={1}
          onClick={() => navigate(-1)}
          cursor="pointer"
        />
        <Heading>Post</Heading>
      </HStack>
      <Stack gap={0} top="50px" h="100%">
        <Post post={post} />
        <CommentsList
          cref={post?.comments}
          post={post}
          user={user}
          comments={comments}
          commentsLoading={commentsLoading}
        />
        <Box
          p={3}
          borderTop="1px solid #EF5D60"
          bg="brand.400"
          position="sticky"
          bottom="0"
          zIndex="1000"
        >
          <HStack spacing={2} w="full" position="relative">
            <HStack w="full" position="relative">
              <Input
                placeholder="Type your message..."
                value={myComment || ""}
                ref={inputRef}
                onChange={(e) => setMyComment(e.target.value)}
                onKeyDown={handleKeyDown}
                bg="white"
                border="2px solid #EF5D60"
                pr={10}
              />
              <Icon
                position="absolute"
                right="10px"
                as={HiOutlineEmojiHappy}
                boxSize="25px"
                color="brand.500"
                cursor="pointer"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
              />
            </HStack>
            <Stack
              bg="brand.500"
              h="40px"
              w="40px"
              rounded="6px"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              onClick={addComment}
            >
              {commentsLoading ? (
                <Spinner size="sm" color="white" />
              ) : (
                <Icon as={FiSend} boxSize="20px" color="white" />
              )}
            </Stack>

            {showEmojiPicker && (
              <Box position="absolute" zIndex="1000" right="20px" bottom="80px">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  theme="light"
                  height="350px"
                  width="300px"
                />
              </Box>
            )}
          </HStack>
        </Box>
      </Stack>
    </Stack>
  );
};
