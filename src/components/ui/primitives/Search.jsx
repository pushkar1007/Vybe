import { Box, Stack, Text, Image, HStack, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import firebaseUserdb from "@/firebase/firebase.userdb";
import { useNavigate } from "react-router-dom";
import { LuSearch } from "react-icons/lu";
import InputTab from "./InputTab";

const Search = ({ scope = "all", vybuds = [], ...props }) => {
  const [input, setInput] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setFetchingUsers(true);
      try {
        const snapshot = await getDocs(collection(firebaseUserdb.db, "users"));
        let users = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (scope === "vybuds" && vybuds.length > 0) {
          users = users.filter((user) => vybuds.includes(user.id));
        } else if (scope === "vybuds" && vybuds.length === 0) {
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
    if (!input.trim()) {
      setFilteredUsers([]);
      return;
    }

    setSearching(true);
    const timeout = setTimeout(() => {
      const result = allUsers.filter(
        (user) =>
          user?.username?.toLowerCase().includes(input.toLowerCase()) ||
          user?.handlename?.toLowerCase().includes(input.toLowerCase()),
      );
      setFilteredUsers(result);
      setSearching(false);
    }, 200);

    return () => clearTimeout(timeout);
  }, [input, allUsers]);

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
          {fetchingUsers || searching ? (
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
