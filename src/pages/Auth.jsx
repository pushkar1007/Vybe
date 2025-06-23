import SpinnerBtn from "@/components/ui/SpinnerBtn";
import LogoIcon from "../components/icons/LogoIcon";
import { Heading, HStack, Icon, Stack, Text, VStack } from "@chakra-ui/react";

const Auth = () => {
  const buttonDetails = [
    {
      text: "Sign Up",
      link: "/signup",
      label: "Already have an account?",
    },
    {
      text: "Login",
      link: "/login",
      label: "Don’t have an account?",
    },
  ];

  return (
    <HStack bg="brand.500">
      <Stack
        alignItems="center"
        justifyContent="center"
        w="50%"
        h="100vh"
        bg="brand.400"
        borderRightRadius="30px"
        boxShadow="12px 12px 4px rgba(0,0,0,0.1)"
      >
        <Icon
          as={LogoIcon}
          h="120px"
          w="275px"
          color="brand.200"
        />
      </Stack>
      <VStack p="100px" w="50%" h="100vh">
        <Heading
          fontSize="64px"
          fontWeight="bold"
          fontStyle="italic"
          color="brand.400"
          w="350px"
          lineHeight="1"
          alignSelf="start"
        >
          Your Tribe Your Vybe
        </Heading>
        <VStack gap="40px" my="auto">
          {buttonDetails.map((detail) => (
            <VStack key={detail.text}>
              <Text color="brand.400" fontSize="20px" fontWeight="bold">
                {detail.label}
              </Text>
              <SpinnerBtn
                type="button"
                text={detail.text}
                w="353px"
                h="82px"
                rounded="80px"
                fontSize="26px"
                fontWeight="bold"
                to={detail.link}
              />
            </VStack>
          ))}
        </VStack>
      </VStack>
    </HStack>
  );
};

export default Auth;
