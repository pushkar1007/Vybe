import { useEffect, useState } from "react";
import { Stack, Spinner } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import firebaseUserdb from "@/firebase/firebase.userdb";
import Post from "@/components/ui/post/Post";
import UserDetails from "@/components/ui/profile/UserDetails";
import PageHeader from "@/components/common/PageHeader";

const Profile = () => {
  const { uid } = useParams();
  const { user: currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!uid) return;
      try {
        const userRef = doc(firebaseUserdb.db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData({ id: userSnap.id, ...userSnap.data() });
        } else {
          setUserData(null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, [uid]);

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
          .sort((a, b) => Number(b.createdAt) - Number(a.createdAt));

        setPosts(fetchedPosts);
      } catch (err) {
        console.error("Error fetching created posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatedPosts();
  }, [userData]);

  return (
    <Stack gap={0} zIndex="0">
      <PageHeader page="profile" data={userData} />
      {userData && (
        <UserDetails data={userData} isOwner={uid === currentUser?.uid} />
      )}
      {loading ? (
        <Spinner alignSelf="center" mt={6} size="lg" />
      ) : (
        posts.map((post) => <Post key={post.id} post={post} />)
      )}
    </Stack>
  );
};

export default Profile;
