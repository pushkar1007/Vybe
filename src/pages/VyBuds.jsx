import VyBudCard from "@/components/ui/vybuds/VyBudCard";
import VyBudsHeader from "@/components/ui/vybuds/VyBudsHeader";
import { useAuth } from "@/context/AuthContext";
import firebaseUserdb from "@/firebase/firebase.userdb";
import { Heading, Spinner, Stack } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { use, useEffect, useState } from "react";

const VyBuds = () => {
  const [vybuds, setVybuds] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      if (!user.uid) return;
      try {
        const userRef = doc(firebaseUserdb.db, "users", user.uid);
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
  }, [user.uid]);

  useEffect(() => {
    const fetchVybuds = async () => {
      if (!userData?.vybuds?.length) {
        setVybuds([]);
        setLoading(false);
        return;
      }
      try {
        const vybudSnapshots = await Promise.all(
          userData.vybuds.map((uid) => {
            const ref = doc(firebaseUserdb.db, "users", uid);
            return getDoc(ref);
          }),
        );
        const fetchedvybuds = vybudSnapshots
          .filter((doc) => doc.exists())
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        setVybuds(fetchedvybuds);
      } catch (error) {
        console.error("Error fetching vybuds:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userData) {
      fetchVybuds(); 
    }
  }, [userData]);

  return (
    <Stack h="full" w="full">
      <VyBudsHeader userData={userData} />
      {loading ? (
        <Stack h="full" w="full" justify="center" align="center">
          <Spinner size="xl" />
        </Stack>
      ) : vybuds.length === 0 ? (
        <Heading alignSelf="center" justifySelf="center">
          No VyBuds yet!
        </Heading>
      ) : (
        vybuds.map((vybud) => (
          <VyBudCard
            key={vybud.id}
            vybud={vybud}
            onRemove={(id) =>
              setVybuds((prev) => prev.filter((v) => v.id !== id))
            }
          />
        ))
      )}
    </Stack>
  );
};

export default VyBuds;
