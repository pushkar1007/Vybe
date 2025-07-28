import { Box, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import firebasePostDB from "../../../firebase/firebase.postdb";
import firebaseUserDB from "../../../firebase/firebase.userdb";
import Post from "./Post";
import PostInput from "./PostInput";
import { isMatch } from "lodash";

const PostFeed = ({ targetType = "user", targetId = "#", filter }) => {
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

      if (targetType.toLowerCase().trim() === "user") {
        const userPosts = enrichedPosts.filter((post) =>
          isMatch(post, { targetType: "user" }),
        );
        setPosts(userPosts);
      } else if (targetType.toLowerCase().trim() === "vybecircle") {
        const vybeCirclePosts = enrichedPosts.filter((post) =>
          isMatch(post, { targetId: `${targetId}` }),
        );

        setPosts(vybeCirclePosts);
      }
    }, filter);

    return () => unsubscribe();
  }, [filter, targetType, targetId]);

  return (
    <Stack bg="brand.400" gap="0">
      {targetType.toLowerCase().trim() === "user" ? <PostInput /> : null}
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </Stack>
  );
};

export default PostFeed;
