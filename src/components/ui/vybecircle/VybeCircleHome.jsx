import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import firebaseVybecirclesdb from "@/firebase/firebase.vybecirclesdb";
import { Box, Heading, HStack, Icon, Spinner, Stack } from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa";
import VybeCircleMenu from "./VybeCircleMenu";
import PostFeed from "../post/PostFeed";
import { VybeCircleFilter } from "./vybeCircleFilter";
import { query } from "firebase/database";
import { collection, orderBy } from "firebase/firestore";

//the page of a single vybecircle interface
export const VybeCircleHome = () => {
  const { vybecircleId } = useParams();
  const [circleData, setCircleData] = useState(null);
  const [filter, setFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  let q = null;

  if (filter == "likes_desc") {
    q = query(
      collection(firebaseVybecirclesdb.db, "posts"),
      orderBy("likes", "desc"),
    );
  } else if (filter == "comments_desc") {
    q = query(
      collection(firebaseVybecirclesdb.db, "posts"),
      orderBy("comments", "desc"),
    );
  } else if (filter == "time_asc") {
    q = query(
      collection(firebaseVybecirclesdb.db, "posts"),
      orderBy("createdAt", "asc"),
    );
  } else if (filter == "time_desc") {
    q = query(
      collection(firebaseVybecirclesdb.db, "posts"),
      orderBy("createdAt", "desc"),
    );
  }

  async function fetchCircleData() {
    try {
      const fetchedData =
        await firebaseVybecirclesdb.getVybecircle(vybecircleId);
      if (fetchedData) {
        setCircleData(fetchedData);
      }
    } catch (error) {
      console.error("Error fetching vybecircle data", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCircleData();
  }, []);

  if (!circleData && !loading) {
    return <div>no such vybecircle exists!</div>;
  } else if (!circleData && loading) {
    return <Spinner />;
  } else if (circleData && !loading) {
    return (
      <>
        <HStack
          bgImage={`url(${
            circleData?.banner ||
            "https://res.cloudinary.com/dw1ikwae9/image/upload/v1753372126/vybcricle_banner_uevbiz.png"
          })`}
          bgRepeat="no-repeat"
          backgroundPosition="center"
          backgroundSize="cover"
          color="white"
          borderBottom="1px solid"
          borderColor="brand.500"
          h="100px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexGrow={0}
          px={4}
          py={3}
          gap={4}
        >
          <Icon
            as={FaArrowLeft}
            color="brand.500"
            my={1}
            onClick={() => {
              navigate(-1);
            }}
            cursor="pointer"
          />
          <Stack gap={0} m={0}>
            <Heading m={0}>{circleData?.name || ""}</Heading>
            <div fontSize="sm">{circleData?.users?.length ?? 0} Members</div>
          </Stack>
          <VybeCircleMenu vybeCircleData={circleData} />
        </HStack>
        <Box display="flex" justifyContent="end" padding="4px">
          <VybeCircleFilter filterSetter={setFilter} />
        </Box>

        <PostFeed
          targetId={`${vybecircleId}`}
          targetType="vybecircle"
          filter={q}
        />
      </>
    );
  }
};
