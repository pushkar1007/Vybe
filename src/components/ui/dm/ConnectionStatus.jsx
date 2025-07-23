import { useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";
import { connection } from "@/firebase/firebase.dmdb";
import ChatButton from "./ChatButton";
import { collection, doc, onSnapshot } from "firebase/firestore";

const ConnectionStatus = ({
  request,
  setRequest,
  currentUser,
  chatPartner,
}) => {
  async function autoDeleteReq() {
    try {
      if (!request) return;
      const timeDiff = Math.abs(Number(Date.now()) - Number(request.createdAt));
      if (timeDiff > 6000 && request.status === -1) {
        await connection.deleteConnection(request.id);
        setRequest(null);
      }
    } catch (error) {
      console.error("Error auto-deleting connection:", error);
    }
  }

  useEffect(() => {
    let unsubscribeDoc;
    let unsubscribeCollection;

    const fetchConnection = async () => {
      try {
        const res = await connection.getConnectionReq(chatPartner, currentUser);
        if (res && res.length > 0) {
          const newReq = res[0];
          setRequest(newReq);

          unsubscribeDoc = onSnapshot(
            doc(connection.db, "dmReqs", newReq.id),
            (docSnap) => {
              const updated = { id: docSnap.id, ...docSnap.data() };
              setRequest(null);
              setRequest(updated);
            },
          );
        }

        const dmReqsRef = collection(connection.db, "dmReqs");
        unsubscribeCollection = onSnapshot(dmReqsRef, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const data = change.doc.data();
              const usersInvolved = [data.initiator, data.acceptor];
              if (
                usersInvolved.includes(currentUser) &&
                usersInvolved.includes(chatPartner)
              ) {
                const newReq = { id: change.doc.id, ...data };
                setRequest(null);
                setRequest(newReq);
              }
            }
          });
        });
      } catch (error) {
        console.error("Error in ConnectionStatus snapshot:", error);
      }
    };

    fetchConnection();

    if (request) autoDeleteReq();

    return () => {
      if (unsubscribeDoc) unsubscribeDoc();
      if (unsubscribeCollection) unsubscribeCollection();
    };
  }, [chatPartner, currentUser]);

  if (request?.status === 0) {
    return (
      <Box
        bg="gray.100"
        p={4}
        borderBottom="1px solid #ccc"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Text>Your Request is Pending!</Text>
      </Box>
    );
  }

  return (
    <Box>
      {request == null ? (
        <Box
          bg="gray.100"
          p={4}
          borderBottom="1px solid #ccc"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <ChatButton initiator={currentUser} acceptor={chatPartner} />
        </Box>
      ) : null}
    </Box>
  );
};

export default ConnectionStatus;
