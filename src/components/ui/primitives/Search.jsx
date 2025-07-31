import { Box, Stack, Text, Image, HStack, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import firebaseUserdb from "@/firebase/firebase.userdb";
import firebaseVybecirclesdb from "@/firebase/firebase.vybecirclesdb";
import { useNavigate } from "react-router-dom";
import { LuSearch } from "react-icons/lu";
import InputTab from "./InputTab";
import { useAuth } from "@/context/AuthContext";

const Search = ({ scope = "all", vybuds = [], ...props }) => {
  const [input, setInput] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [joinedCircles, setJoinedCircles] = useState([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!["vybuds", "all"].includes(scope)) return;

      setFetchingUsers(true);
      try {
        const snapshot = await getDocs(collection(firebaseUserdb.db, "users"));
        let users = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (scope === "vybuds" && vybuds.length > 0) {
          users = users.filter((user) => vybuds.includes(user.id));
        }

        setAllUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setFetchingUsers(false);
      }
    };

    fetchUsers();
  }, [scope, JSON.stringify(vybuds)]);

  useEffect(() => {
    const fetchCircles = async () => {
      const circles = await firebaseVybecirclesdb.getVybecirclesForUser(user.uid);
      setJoinedCircles(circles);
    };

    if (user.uid) fetchCircles();
  }, [user.uid]);

  useEffect(() => {
    if (!input.trim()) {
      setFilteredResults([]);
      return;
    }

    setSearching(true);
    const timeout = setTimeout(() => {
      const lowerInput = input.toLowerCase();

      if (scope === "vybecircles") {
        const result = joinedCircles.filter(
          (circle) =>
            circle?.name?.toLowerCase().includes(lowerInput) ||
            circle?.description?.toLowerCase().includes(lowerInput),
        );
        setFilteredResults(result);
      } else {
        const result = allUsers.filter(
          (user) =>
            user?.username?.toLowerCase().includes(lowerInput) ||
            user?.handlename?.toLowerCase().includes(lowerInput),
        );
        setFilteredResults(result);
      }

      setSearching(false);
    }, 200);

    return () => clearTimeout(timeout);
  }, [input, allUsers, joinedCircles, scope]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-wrapper")) {
        setInput("");
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const renderResults = () => {
    if (fetchingUsers || searching) {
      return <Spinner size="sm" p={4} />;
    }

    if (filteredResults.length === 0) {
      return (
        <Text px={4} py={2} color="gray.400">
          No {scope === "vybecircles" ? "VybeCircles" : "users"} found
        </Text>
      );
    }

    const truncateText = (text, maxLength) => {
      if (!text) return "";
      return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    };

    return filteredResults.map((item) => (
      <HStack
        key={item.id}
        px={4}
        py={2}
        cursor="pointer"
        borderBottom="1px solid"
        borderColor="brand.500"
        onClick={() =>
          navigate(
            scope === "vybecircles"
              ? `/vybcircles/${item.id}`
              : `/profile/${item.id}`,
          )
        }
      >
        <Image
          src={(scope === "vybuds" ? item.avatar : item.logo) || "/images/profilepic.png"}
          boxSize="30px"
          rounded="full"
        />
        <Stack spacing={0} px={2} pt={3}>
          <Text
            fontWeight="bold"
            fontSize="sm"
            color="brand.200"
            lineHeight="0"
          >
            {scope === "vybecircles"
              ? item.name || "No Name"
              : item.handlename || "No Name"}
          </Text>
          <Text fontSize="xs" color="brand.100">
            {scope === "vybecircles"
              ? truncateText(item.description, 20) || ""
              : `@${item.username}`}
          </Text>
        </Stack>
      </HStack>
    ));
  };

  return (
    <Box
      className="search-wrapper"
      position="relative"
      maxW={{ base: "160px", md: "200px", lg: "260px" }}
      w="100%"
    >
      <InputTab
        startElement={<LuSearch color="white" size="18px" />}
        placeholder="Wanna Vybe?"
        value={input}
        w={{ base: "160px", md: "200px", lg: "260px" }}
        onChange={(e) => setInput(e.target.value)}
        {...props}
      />

      {input && (
        <Box
          position="absolute"
          top="100%"
          mt={1}
          left={0}
          w="100%"
          bg="brand.400"
          rounded="md"
          shadow="md"
          zIndex={999}
          maxH="300px"
          overflowY="auto"
        >
          {renderResults()}
        </Box>
      )}
    </Box>
  );
};

export default Search;
