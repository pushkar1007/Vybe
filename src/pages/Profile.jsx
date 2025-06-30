import { useEffect, useState } from "react";
import { Stack, Spinner } from "@chakra-ui/react";
import { getDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import Post from "@/components/ui/Post";
import UserDetails from "@/components/ui/UserDetails";

const Profile = () => {
  const { userData, refreshUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreatedPosts = async () => {
      if (!userData?.createdPosts?.length) {
        setPosts([]);
        setLoading(false);
        return;
      }

      try {
        const postSnapshots = await Promise.all(
          userData.createdPosts.map((ref) => getDoc(ref)),
        );

        const fetchedPosts = postSnapshots
          .filter((doc) => doc.exists())
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => Number(b.createdAt) - Number(a.createdAt)); // Sort latest first

        setPosts(fetchedPosts);
        refreshUser();
      } catch (err) {
        console.error("Error fetching created posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatedPosts();
  }, [userData]);

  return (
    <Stack>
      <UserDetails />
      {loading ? (
        <Spinner alignSelf="center" mt={6} size="lg" />
      ) : (
        posts.map((post) => <Post key={post.id} post={post} />)
      )}
    </Stack>
  );
};

export default Profile;
