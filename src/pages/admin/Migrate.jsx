import { getDocs, collection, updateDoc, doc } from "firebase/firestore";

import firebasePostdb from "@/firebase/firebase.postdb";
import { Button, Box, Text } from "@chakra-ui/react";
import { useState } from "react";

const MigratePosts = () => {
  const [status, setStatus] = useState("");

  const migratePosts = async () => {
    setStatus("Migrating...");
    try {
      const snapshot = await getDocs(collection(firebasePostdb.db, "posts"));
      let updated = 0;

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        if (!data.targetType || !data.targetId) {
          await updateDoc(doc(firebasePostdb.db, "posts", docSnap.id), {
            targetType: "user",
            targetId: data.createdBy,
          });
          updated++;
        }
      }

      setStatus(`✅ Migration complete. ${updated} posts updated.`);
    } catch (err) {
      console.error("Migration failed", err);
      setStatus("❌ Migration failed. See console.");
    }
  };

  return (
    <Box p={6}>
      <Text mb={4}>
        Click the button to migrate posts (add targetType and targetId)
      </Text>
      <Button colorScheme="blue" onClick={migratePosts}>
        Migrate Posts
      </Button>
      <Text mt={4}>{status}</Text>
    </Box>
  );
};

export default MigratePosts;
