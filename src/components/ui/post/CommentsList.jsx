import {
  Flex,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import Comment from "./Comment";

const CommentsList = ({ cref, post, user, comments, commentsLoading }) => {
  return (
    <Flex direction="column" h="100%">
      {commentsLoading || !post || !cref || !user ? (
        <Spinner size="md" alignSelf="center" />
      ) : (
        <>
          <Stack
            flex={1}
            overflowY="auto"
            spacing={3}
            css={{
              "&::-webkit-scrollbar": {
                display: "none",
              },
              "&": {
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              },
            }}
          >
            {comments.map((comment) => (
              <Comment comment={comment} key={comment.commentId} />
            ))}
          </Stack>
        </>
      )}
    </Flex>
  );
};

export default CommentsList;