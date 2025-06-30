import { Box, Stack, Text, Image, HStack, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import firebaseUserdb from "@/firebase/firebase.userdb";
import { useNavigate } from "react-router-dom";
import { LuSearch } from "react-icons/lu";
import InputTab from "./InputTab";

const Search = () => {
  const [input, setInput] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch all users once
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const usersRef = collection(firebaseUserdb.db, "users");
        const snapshot = await getDocs(usersRef);
        const users = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllUsers(users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchAllUsers();
  }, []);

  // Filter users on input
  useEffect(() => {
    if (!input.trim()) {
      setFilteredUsers([]);
      return;
    }

    setLoading(true);
    const debounce = setTimeout(() => {
      const results = allUsers.filter(
        (user) =>
          user.username?.toLowerCase().includes(input.toLowerCase()) ||
          user.handlename?.toLowerCase().includes(input.toLowerCase()),
      );
      setFilteredUsers(results);
      setLoading(false);
    }, 200);

    return () => clearTimeout(debounce);
  }, [input, allUsers]);

  // Optional: Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-wrapper")) {
        setInput("");
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <Box className="search-wrapper" position="relative" maxW="300px" w="100%">
      <InputTab
        startElement={<LuSearch color="white" size="18px" />}
        placeholder="Wanna Vybe?"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        w="100%"
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
          {loading ? (
            <Spinner size="sm" p={4} />
          ) : filteredUsers.length === 0 ? (
            <Text px={4} py={2} color="gray.400">
              No users found
            </Text>
          ) : (
            filteredUsers.map((user) => (
              <HStack
                key={user.id}
                px={4}
                py={2}
                cursor="pointer"
                borderBottom="1px solid"
                borderColor="brand.500"
                onClick={() => navigate(`/profile/${user.id}`)}
              >
                <Image
                  src={user.avatar || "/images/profilepic.png"}
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
                    {user.handlename || "No Name"}
                  </Text>
                  <Text fontSize="xs" color="brand.100">
                    @{user.username}
                  </Text>
                </Stack>
              </HStack>
            ))
          )}
        </Box>
      )}
    </Box>
  );
};

export default Search;
