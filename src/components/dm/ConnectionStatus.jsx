import React, { useState, useEffect } from "react";
import { Box, Button } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { connection } from "@/firebase/firebase.dmdb";
import ChatButton from "./ChatButton";
import { collection, doc, onSnapshot } from "firebase/firestore";
import isEqual from "lodash/isEqual";

const ConnectionStatus = () => {
  const param = useParams();
  const [chatPartner, currentUser] = param.roomId.split("-");
  const [request, setRequest] = useState(null);

  async function getRequests() {
    try {
      const response = await connection.getConnectionReq(
        chatPartner,
        currentUser,
      );

      // If no request found
      if (!response || response.length === 0) {
        if (request !== null) setRequest(null);
        return null;
      }

      const newReq = response[0];

      // ✅ Compare using lodash's deep comparison
      if (!isEqual(newReq, request)) {
        setRequest(newReq);
      }

      return newReq;
    } catch (error) {
      console.error("Error fetching connection request:", error);
      return null;
    }
  }

  async function autoDeleteReq() {
    try {
      //console.log(request)//if useEffect is used w/o dependecny, useeffect only runs one time hence after the null state of request has been updated there is nothing to re run this function so it is stuck with the null request value keep in mind useEffect only runs on initial mount of components if no other dependecies are defined
      if (!request) return;
      const timeDiff = Math.abs(Number(request.createdAt) - Number(Date.now()));
      if (timeDiff > 6000 && (request.status == 0 || request.status==-1)) {
        await connection.deleteConnection(request.id);
      }
    } catch (error) {
      console.error("Error deleting connection request:", error);
    }
  }

  useEffect(() => {
    let unsubscribeDoc;
    let unsubscribeCollection;
    console.log("hello");
    (async () => {
      try {
        const req = await getRequests();

        if (req) {
          unsubscribeDoc = onSnapshot(
            doc(connection.db, "dmReqs", req.id),
            (docSnap) => {
              const updated = { id: docSnap.id, ...docSnap.data() };
              setRequest((prev) => (!isEqual(prev, updated) ? updated : prev));
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
                setRequest((prev) => (!isEqual(prev, newReq) ? newReq : prev));//this line saved my screen from being smashed👍
              }
            }
          });
        });
      } catch (error) {
        console.error("error in fetching request: ", error);
      }
    })();

    if (request) {
      autoDeleteReq();
    }

    return () => {
      if (unsubscribeDoc) unsubscribeDoc();
      if (unsubscribeCollection) unsubscribeCollection();
    };
  }, [request]);


  return (
    <Box bg="gray.100" p={4} borderBottom="1px solid #ccc">
      {request == null ? (
        <ChatButton initiator={currentUser} acceptor={chatPartner} />
      ) : request.initiator == currentUser ? (
        <div>
          {request.status == 0
            ? "the request is pending please wait"
            : request.status == 1
              ? "the request has been accepted"
              : "the request has been rejected"}
        </div>
      ) : (
        <div>
          {request.status == 0 ? (
            <div>
              the request is pending selct your action
              <Button
                onClick={() => connection.acceptConnection(request?.id)}
                bgColor="green"
                mt={2}
              >
                Accept
              </Button>
              <Button
                onClick={() => connection.rejectConnection(request?.id)}
                bgColor="red"
                mt={2}
                ml={2}
              >
                Reject
              </Button>
            </div>
          ) : request.status == 1 ? (
            "you accepted the  request"
          ) : (
            "you rejected the request"
          )}
        </div>
      )}
    </Box>
  );
};

export default ConnectionStatus;
