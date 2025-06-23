import AuthForm from "@/components/ui/AuthForm";
import { Stack } from "@chakra-ui/react";

const SignUp = () => {
  return (
    <Stack alignItems="center" justifyContent="center" h="100vh" w="100vw">
      <AuthForm mode="signup"/>
    </Stack>
  );
};

export default SignUp;