import AuthForm from "@/components/ui/AuthForm";
import { Stack } from "@chakra-ui/react";

const Login = () => {
  return (
    <Stack alignItems="center" justifyContent="center" h="100vh" w="100vw">
      <AuthForm mode="login"/>
    </Stack>
  );
};

export default Login;