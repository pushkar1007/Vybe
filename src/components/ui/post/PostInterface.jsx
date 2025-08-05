import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import firebasePostdb from "@/firebase/firebase.postdb";
import { useAuth } from "@/context/AuthContext";
import Post from "./Post";
import CommentsList from "./CommentsList";
import { Heading, HStack, Icon, Stack } from "@chakra-ui/react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { isEqual } from "lodash";
import firebaseCommentsdb from "@/firebase/firebase.commentsdb";
import { firebaseNotifications } from "@/firebase/firebase.notifications";
import ChatInput from "../dm/ChatInput";
import PageHeader from "@/components/common/PageHeader";

export const PostInterface = () => {
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState(null);
  const [myComment, setMyComment] = useState(null);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null);
  const { postId } = useParams();
  const { user, userData } = useAuth();
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
        postId,
      );
      await addCommentToPost(postId, comment.id);
      await getComments(post?.comments);
      {post.createdBy === user.uid
        ? null
        : await firebaseNotifications.createNotification({
            id: `post_comment_${comment.id}_${user.uid}`,
            type: "post_comment",
            senderId: user.uid,
            receiverId: post.createdBy,
            senderHandle: userData.handlename || "Anonymous",
            status: "static",
            message: `${userData.handlename} has commented on your Post!`,
            relatedId: postId,
          });}
      setMyComment("");
      setShowEmojiPicker(false);
    } catch (error) {
      console.error("Error creating comment:", error);
    }
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
    const unsubscribe = firebasePostdb.listenToPost(postId, (updatedPost) => {
      setPost(updatedPost);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [postId]);

  return loading ? (
    <>Loading....</>
  ) : (
    <Stack gap={0} h="100%">
      <PageHeader page="Post" />
      <Stack gap={0} top="50px" h="100%">
        <Post post={post} />
        <PageHeader page="Comments" />
        <CommentsList
          cref={post?.comments}
          post={post}
          user={user}
          comments={comments}
          commentsLoading={commentsLoading}
        />
        <ChatInput
          type="comment"
          commentsLoading={commentsLoading}
          addComment={addComment}
          inputValue={myComment}
          setInputValue={setMyComment}
          inputRef={inputRef}
        />
      </Stack>
    </Stack>
  );
};
