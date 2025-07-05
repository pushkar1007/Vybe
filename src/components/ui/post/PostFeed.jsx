import { Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import firebasePostDB from "../../../firebase/firebase.postdb";
import firebaseUserDB from "../../../firebase/firebase.userdb";
import Post from "./Post";
import PostInput from "./PostInput";

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const userCache = {};

  useEffect(() => {
    const unsubscribe = firebasePostDB.listenToPosts(async (postsData) => {
      const enrichedPosts = await Promise.all(
        postsData.map(async (post) => {
          const creatorId = post.createdBy;

          if (!userCache[creatorId]) {
            const userData = await firebaseUserDB.getUserData(creatorId);
            userCache[creatorId] = userData;
          }

          return {
            ...post,
            createdBy: userCache[creatorId],
          };
        }),
      );

      setPosts(enrichedPosts);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Stack bg="brand.400" gap="0">
      <PostInput />
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </Stack>
  );
};

export default PostFeed;
