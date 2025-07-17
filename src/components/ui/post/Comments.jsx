import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import firebaseCommentsdb from "@/firebase/firebase.commentsdb";
import { Box, HStack, Icon, Input, Spinner, Stack } from "@chakra-ui/react";
import EmojiPicker from "emoji-picker-react";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { FiSend } from "react-icons/fi";
import { filter, isEqual } from "lodash";


export default function Comments ({cref, post,user,onAddCommentToPost})  {
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [comments, setComments] = useState(null);
  const [myComment, setMyComment] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null);
  const { postId } = useParams();

  const getComments = async (cref) => {
    console.log("executed")
    if (!cref || cref.length === 0) {
      console.log("No comments were found");
      setComments([]);
      return;
    }

    try {
      const commentPromises = cref.map((ref) =>
        firebaseCommentsdb.getComment(ref.id),
      );

      const fetchedComments = await Promise.all(commentPromises);
      const filteredComments = fetchedComments.filter(Boolean); // remove any null responses

      setComments(prev=>!isEqual(filteredComments,prev)?filteredComments:prev);
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
      await onAddCommentToPost(postId, comment.id);
      await getComments(post.comments);
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
          await getComments(cref)
          setCommentsLoading(false);
        } catch (error) {
          console.log("Error fetching comments: ", error);
        }
      })();
    }, [cref]);

  return (
    <div style={{ height: "70%" }}>
      {commentsLoading || !post || !cref || !user ? (
        <Spinner size="md" />
      ) : (
        <>
          <div style={{ height: "90%" }}>
            {comments
              ? comments.map((comment) => (
                  <div key={comment.commentId}>{comment.content}</div>
                ))
              : "no comments yet"}
          </div>
          <Box
            p={3}
            borderTop="1px solid #EF5D60"
            position="sticky"
            bottom="0"
            bg="brand.400"
          >
            <HStack spacing={2} w="full" position="relative">
              <HStack w="full" position="relative">
                <Input
                  placeholder="Type your message..."
                  value={myComment ? myComment : ""}
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
                <Box
                  position="absolute"
                  zIndex="1000"
                  right="20px"
                  bottom="80px"
                >
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
        </>
      )}
    </div>
  );
};
