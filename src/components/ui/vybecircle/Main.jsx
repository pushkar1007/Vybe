import { Box, Heading, HStack, Icon, Spinner, Stack } from "@chakra-ui/react";
import { VybeCircleDialog } from "./VybeCircleDialog";
import { useAuth } from "@/context/AuthContext";
import { VybeCircleCard } from "./VybeCircleCard";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

//this is the main page of vybecircles i.e the page on route /vybecircles
export const Main = () => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  return (
    <>
      <Box display={"flex"} height={"10%"} justifyContent={"end"}>
        <HStack
          borderBottom="1px solid"
          borderColor="brand.500"
          h="100%"
          w="100%"
          alignItems="center"
          gap={4}
        >
          <Icon
            as={FaArrowLeft}
            color="brand.500"
            my={1}
            mx={4}
            onClick={() => {
              navigate(-1);
            }}
            cursor="pointer"
          />
          <Heading m={0}>Vybecircles</Heading>
        </HStack>
      </Box>
      <Box display={"flex"} flexDirection={"column"} gap={"40px"} p={4}>
        <VybeCircleDialog
          vybeCircleData={null}
          user={user}
          text={"create"}
          styling={{
            width: {
              base: "138px",
              md: "90px",
              lg: "120px",
              xl: "138px",
            },
            mr: {
              base: "50px",
              md: "10px",
              lg: "40px",
              xl: "50px",
            },
            height: "40px",
            bg: "brand.400",
            color: "brand.200",
            boxShadow: "4px 8px 4px rgba(0,0,0,0.1)",
            mt: "12px",
            fontSize: "16px",
            fontWeight: "bold",
            rounded: "full",
            borderWidth: "2px",
            borderColor: "#ed1c5b",
          }}
        />
        <Stack height={"70%"} direction={"row"}>
          <>
            {userData.vybecircles.length == 0 ? (
              <div>You are not a part of any VybeCircle</div>
            ) : (
              userData.vybecircles.map((circle) => (
                <VybeCircleCard
                  key={circle.id}
                  VybeCircleId={circle.id}
                ></VybeCircleCard>
              ))
            )}
          </>
        </Stack>
      </Box>
    </>
  );
};
