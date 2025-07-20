import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import firebasePostdb from "@/firebase/firebase.postdb";
import { useAuth } from "@/context/AuthContext";
import Comments from "./Comments";

export const PostInterface = () => {
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const { postId } = useParams();
  const {user} = useAuth();

  const addCommentToPost = async (postId, commentId) => {
      try {
        await firebasePostdb.addComment(postId, commentId);
        const updatedPost = await firebasePostdb.getPostData(postId)
        setPost(updatedPost)
      } catch (error) {
        console.log("error adding comment to post", error);
      }
    };

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
    <div style={{ height: "100%" }}>
      <div style={{ height: "30%" }}>{post.content}</div>
      <Comments cref={post?.comments} post={post} user={user} onAddCommentToPost={addCommentToPost}/>
    </div>
  );
};
