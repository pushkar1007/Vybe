import { Box, Stack } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import { VybeCircleCard } from "./VybeCircleCard"
import VyBudsHeader from "../vybuds/VyBudsHeader";
import VybeCircleDialog from "./VybeCircleDialog";

export const Main = () => {
  const { user, userData } = useAuth();
  return (
    <>
      <VyBudsHeader page="VybCircles" scope="vybecircles" />
      <Box display={"flex"} flexDirection={"column"} gap={"40px"} p={4}>
        <VybeCircleDialog
          vybeCircleData={null}
          user={user}
          text={"Create"}
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
