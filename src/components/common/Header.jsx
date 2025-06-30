import { Box, HStack, Icon, Stack } from "@chakra-ui/react";
import LogoIcon from "../icons/LogoIcon";
import InputTab from "../ui/InputTab";
import ProfileMenu from "../ui/ProfileMenu";
import { Link } from "react-router-dom";
import { LuSearch } from "react-icons/lu";
import HamburgerMenu from "./HamburgerMenu";
import { collection, onSnapshot } from "firebase/firestore";
import firebaseUserdb from "@/firebase/firebase.userdb";
import { useState } from "react";
import Search from "../ui/Search";

const Header = () => {
  const [users, setUsers] = useState(null);

  const searchUsers = (e) => {
    const value = e.target.value;
    const usersRef = collection(firebaseUserdb.db, "users");
    onSnapshot(usersRef, (snapshot) => {
      const usersList = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      const search = usersList.filter((user) =>
        user.username.toLowerCase().includes(value.toLowerCase()),
      );
      setUsers(search);
      return search;
    });
  };

  return (
    <HStack
      bg="brand.500"
      px={{ base: "4", md: "10", lg: "20" }}
      py="4"
      justifyContent="space-between"
      alignItems="center"
      top="0"
      zIndex="1000"
      position="sticky"
      minH="115px"
      maxH="115px"
      w="full"
    >
      <Stack display={{ base: "block", md: "none" }}>
        <HamburgerMenu />
      </Stack>
      <Box
        position="relative"
        ml={{
          base: "10px",
          lg: "100px",
        }}
        top="-25px"
      >
        <Link to="/">
          <Icon
            as={LogoIcon}
            h="63px"
            w="100px"
            color="brand.300"
            cursor="pointer"
            display={{
              base: "none",
              md: "block",
            }}
            position="absolute"
          />
        </Link>
      </Box>
      <HStack
        gap={{
          base: "20px",
          md: "40px",
          lg: "60px",
        }}
        mt={{
          base: "none",
          md: "8px",
        }}
        alignItems="end"
        position="relative"
      >
        <Search />
        <ProfileMenu />
      </HStack>
    </HStack>
  );
};

export default Header;
