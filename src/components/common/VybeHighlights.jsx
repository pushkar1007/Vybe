import firebaseExplore from "@/firebase/firebase.explore";
import { Box, Heading, HStack, Image, Stack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const VybeHighlights = () => {
  const [trendingWords, setTrendingWords] = useState([]);
  const [randomUsers, setRandomUsers] = useState([]);
  const navigate = useNavigate();
  let limit = 5;

  useEffect(() => {
    async function fetchData() {
      setTrendingWords(await firebaseExplore.getTrendingKeywords(limit));
      setRandomUsers(await firebaseExplore.getRandomUsers(limit = 3));
    }
    fetchData();
  }, []);

  return (
    <Stack
      bg="brand.500"
      color="white"
      w={{
        base: "0px",
        md: "200px",
        lg: "240px",
        lgx: "280px",
        xl: "360px",
      }}
      position="sticky"
      top="115px"
      alignItems="center"
      h="full"
      py={4}
      display={{
        base: "none",
        md: "flex",
      }}
      overflow="hidden"
    >
      <Box
        w="70%"
        maxH="260px"
        css={{
          "@media (max-height: 700px)": {
            height: "200px",
          },
          "@media (min-height: 701px)": {
            height: "260px",
          },
        }}
        border="1px solid white"
        borderRadius="12px"
        p="16px"
        mt="20px"
        spaceY={4}
      >
        <Heading
          fontSize={{
            base: "md",
            md: "lg",
            lg: "xl",
            lgx: "2xl",
            xl: "2xl",
          }}
        >
          Hot Vybes
        </Heading>
        <Stack spacing={2} wrap="wrap">
          {trendingWords.map(({ word }) => (
            <Text
              key={word}
              fontSize={{
                base: "sm",
                md: "md",
                lg: "lg",
                lgx: "xl",
                xl: "xl",
              }}
              variant="solid"
              colorScheme="purple"
            >
              #{word}
            </Text>
          ))}
        </Stack>
      </Box>
      <Box
        w="70%"
        maxH="250px"
        css={{
          "@media (max-height: 700px)": {
            height: "200px",
          },
          "@media (min-height: 701px)": {
            height: "260px",
          },
        }}
        border="1px solid white"
        borderRadius="12px"
        p="16px"
        mt="20px"
        spaceY={4}
      >
        <Heading
          fontSize={{
            base: "md",
            md: "lg",
            lg: "xl",
            lgx: "2xl",
            xl: "2xl",
          }}
        >
          VybeRadar
        </Heading>
        <Stack spaceY={2}>
          {randomUsers.map((user) => (
            <HStack
              key={user.id}
              spaceX={{
                xl: "8px",
              }}
              borderWidth="1px"
              borderRadius="lg"
              borderColor="brand.500"
            >
              <Image
                src={user.avatar || "/images/profilepic.png"}
                h={{
                  base: "30px",
                  md: "40px",
                  lg: "40px",
                }}
                minH={{
                  base: "30px",
                  md: "40px",
                  lg: "40px",
                }}
                w={{
                  base: "30px",
                  md: "40px",
                  lg: "40px",
                }}
                minW={{
                  base: "30px",
                  md: "40px",
                  lg: "40px",
                }}
                alt="profile-picture"
                rounded="full"
                cursor="pointer"
                onClick={() => {
                  navigate(`/profile/${user.id}`);
                }}
              />
              <Stack gap={0}>
                <Text
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  maxW={{
                    base: "60px",
                    xl: "180px",
                  }}
                  fontSize={{
                    base: "sm",
                  }}
                  cursor="pointer"
                  _hover={{ textDecoration: "underline" }}
                  onClick={() => {
                    navigate(`/profile/${user.id}`);
                  }}
                >
                  {user.handlename || "Anonymous"}
                </Text>
                <Text
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  maxW={{
                    base: "60px",
                    xl: "180px",
                  }}
                  fontSize={{
                    base: "xs",
                  }}
                  color="gray.300"
                  cursor="pointer"
                  _hover={{ textDecoration: "underline" }}
                  onClick={() => {
                    navigate(`/profile/${user.id}`);
                  }}
                >
                  @{user.username}
                </Text>
              </Stack>
            </HStack>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
};

export default VybeHighlights;
