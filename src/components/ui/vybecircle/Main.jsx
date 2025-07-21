import { Box } from "@chakra-ui/react"
import { VybeCircleDialog } from "./VybeCircleDialog";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import firebaseUserdb from "@/firebase/firebase.userdb";
export const Main = ()=>{
    const {user,userData} = useAuth();
  
    return(
        <>
         <Box
         padding={"12px"}
         display={"flex"}
         height={"30%"}
         justifyContent={"end"}
         >
           <VybeCircleDialog user={user}/>
         </Box>
        </>
    )
}