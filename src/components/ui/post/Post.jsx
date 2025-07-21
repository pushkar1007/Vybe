import { useEffect, useState } from "react";
import {
  Heading,
  HStack,
  Icon,
  Image,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import { PiShareFat } from "react-icons/pi";
import { formatDistanceToNow } from "date-fns";
import firebaseUserdb from "@/firebase/firebase.userdb";
import firebasePostdb from "@/firebase/firebase.postdb";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Post = ({ post }) => {
  const {
    content,
    image,
    likes,
    comments,
    createdBy,
    createdAt,
    id: postId,
  } = post;

  const [creator, setCreator] = useState(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes?.length || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [openPostInterface, setOpenPostInterface] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    if (currentPath === `/post/${post.postId}`) {
      setOpenPostInterface(false);
    } else {
      setOpenPostInterface(true);
    }
  }, [currentPath, post.postId]);

  const formattedTime = createdAt
    ? formatDistanceToNow(new Date(Number(createdAt)), { addSuffix: true })
    : "";

  useEffect(() => {
    const fetchCreator = async () => {
      if (typeof createdBy === "string") {
        const data = await firebaseUserdb.getUserData(createdBy);
        setCreator(data);
      } else {
        setCreator(createdBy);
      }
    };

    fetchCreator();
  }, [createdBy]);

  useEffect(() => {
    if (!user || !likes) return;

    const liked = likes.some((likeRef) => {
      if (likeRef?.path) {
        const refUid = likeRef.path.split("/").pop();
        return refUid === user.uid;
      }
      return false;
    });

    setHasLiked(liked);
    setLikeCount(likes.length);
  }, [likes, user]);

  const handleLikeToggle = async () => {
    if (!user || isLiking) return;

    setIsLiking(true);

    try {
      if (hasLiked) {
        await firebaseUserdb.unlikePost(postId, user);
        await firebasePostdb.unlikePost(postId, user.uid);
      } else {
        await firebaseUserdb.likePost(postId, user);
        await firebasePostdb.likePost(postId, user.uid);
      }
    } catch (err) {
      console.error("Like toggle failed:", err);
    } finally {
      setIsLiking(false);
    }
  };

  if (!creator) {
    return <Spinner />;
  }

  return (
    <HStack
      py={4}
      px={{ base: 1, md: 4 }}
      gap={4}
      borderBottom="1px solid"
      borderColor="brand.500"
      alignItems="start"
      onClick={() => {
        if (openPostInterface) {
          navigate(`/post/${post.postId}`);
        }
      }}
    >
      <Image
        src={creator.avatar || "/images/profilepic.png"}
        h="50px"
        w="50px"
        alt="profile-picture"
        rounded="full"
        cursor="pointer"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/profile/${creator.id}`);
        }}
      />
      <Stack flex={1}>
        <HStack justifyContent="space-between" w="100%">
          <HStack gap={2} maxW="70%">
            <Heading
              fontSize="md"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              _hover={{ textDecoration: "underline" }}
              cursor="pointer"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${creator.id}`);
              }}
            >
              {creator.handlename || "Anonymous"}
            </Heading>
            <Text
              fontSize="sm"
              color="gray.500"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              maxW="130px"
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${creator.id}`);
              }}
            >
              @{creator.username || "user"}
            </Text>
          </HStack>
          <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
            {formattedTime}
          </Text>
        </HStack>

        <Text fontSize="md" whiteSpace="pre-wrap">
          {content}
        </Text>

        {image && (
          <Image
            src={image}
            alt="post image"
            borderRadius="lg"
            maxH="400px"
            objectFit="cover"
            mt={2}
          />
        )}

        <HStack justifyContent="space-between" color="brand.500">
          <HStack gap={1}>
            <Icon
              as={hasLiked ? IoMdHeart : IoMdHeartEmpty}
              h="24px"
              w="24px"
              cursor="pointer"
              color="brand.500"
              onClick={(e) => {
                e.stopPropagation();
                handleLikeToggle();
              }}
            />
            <Text>{likeCount}</Text>
          </HStack>
          <HStack gap={1.5}>
            <Icon as={FaRegComment} h="20px" w="20px" cursor="pointer" />
            <Text>{comments?.length || 0}</Text>
          </HStack>
          <HStack gap={1}>
            <Icon as={PiShareFat} h="22px" w="22px" cursor="pointer" />
            <Text>Share</Text>
          </HStack>
        </HStack>
      </Stack>
    </HStack>
  );
};

export default Post;
