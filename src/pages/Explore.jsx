import PageHeader from "@/components/common/PageHeader";
import { VybeCircleCard } from "@/components/ui/vybecircle/VybeCircleCard";
import firebaseExplore from "@/firebase/firebase.explore";
import { Box, Text, VStack, HStack, Image, Heading, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Explore = () => {
  const [topCircles, setTopCircles] = useState([]);
  const [trendingWords, setTrendingWords] = useState([]);
  const [randomUsers, setRandomUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setTopCircles(await firebaseExplore.getTopVybecircles());
      setTrendingWords(await firebaseExplore.getTrendingKeywords());
      setRandomUsers(await firebaseExplore.getRandomUsers());
    }
    fetchData();
  }, []);

  return (
    <Stack>
      <PageHeader page="Explore" />
      <VStack spacing={8} p={6} gap={6} align="stretch">
        <Box p={6} rounded={16} spaceY={4} border="1px solid #1D4ED8">
          <Heading size="lg" mb={2}>
            Top Vybecircles
          </Heading>
          <HStack overflowX="auto" justifyContent="space-between">
            {topCircles.map((circle) => (
              <VybeCircleCard
                key={circle.id}
                VybeCircleId={circle.id}
                isExplore
              />
            ))}
          </HStack>
        </Box>

        <Box display="flex" justifyContent="space-between">
          <Box p={6} w="30%" rounded={16} spaceY={4} border="1px solid #1D4ED8">
            <Heading size="lg" mb={2}>
              Hot Vybes
            </Heading>
            <HStack spacing={2} wrap="wrap">
              {trendingWords.map(({ word, count }) => (
                <Text key={word} size="lg" variant="solid" colorScheme="purple">
                  #{word}
                </Text>
              ))}
            </HStack>
          </Box>

          <Box p={6} rounded={16} spaceY={4} w="65%" border="1px solid #1D4ED8">
            <Heading size="lg" mb={2}>
              VybeRadar
            </Heading>
            <HStack spacing={4} justifyContent="space-between" overflowX="auto">
              {randomUsers.map((user) => (
                <VStack
                  key={user.id}
                  p={3}
                  borderWidth="1px"
                  borderRadius="lg"
                  borderColor="brand.500"
                  cursor="pointer"
                  onClick={() => {
                    navigate(`/profile/${user.id}`);
                  }}
                >
                  <Image
                    src={user.avatar || "/images/profilepic.png"}
                    h="50px"
                    w="50px"
                    alt="profile-picture"
                    rounded="full"
                  />
                  <Text>{user.handlename || "Anonymous"}</Text>
                  <Text fontSize="xs" color="gray.500">
                    @{user.username}
                  </Text>
                </VStack>
              ))}
            </HStack>
          </Box>
        </Box>
      </VStack>
    </Stack>
  );
};

export default Explore;
