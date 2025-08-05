import AuthForm from "@/components/ui/auth/AuthForm";
import { Stack } from "@chakra-ui/react";

const SignUp = () => {

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      h="100vh"
      w="100vw"
      bgImage="url(./images/bg-image.png)"
      bgSize="cover"
    >
      <AuthForm mode="signup" />
    </Stack>
  );
};

export default SignUp;
