import AuthForm from "@/components/ui/AuthForm";
import { Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const SignUp = () => {

  const { createUser } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (values, actions) => {
    const { email, password } = values;
    try {
      const user = await createUser({ email, password });
      if (user) {
        navigate("/");
      } else {
        actions.setFieldError("general", "Sign Up failed. Try again.")
      }
    } catch (error) {
      actions.setFieldError("general", error.message || "Error during Sign Up")
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Stack alignItems="center" justifyContent="center" h="100vh" w="100vw" bgImage="url(./images/bg-3.png)" bgSize="cover" >
      <AuthForm mode="signup"/>
    </Stack>
  );
};

export default SignUp;