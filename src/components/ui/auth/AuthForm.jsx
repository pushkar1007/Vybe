import { Heading, VStack, Text, Box, HStack } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputTab from "../primitives/InputTab";
import { LuUserRound } from "react-icons/lu";
import { AiOutlineMail } from "react-icons/ai";
import { IoLockClosedOutline } from "react-icons/io5";
import SpinnerBtn from "../primitives/SpinnerBtn";
import Firebase from "@/firebase/firebase.auth";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import firebaseUserdb from "@/firebase/firebase.userdb";
import { useNavigate } from "react-router-dom";

const AuthForm = ({ mode }) => {
  const navigate = useNavigate();
  const isSignup = mode === "signup";

  const { refreshUser } = useAuth();

  const initialValues = {
    username: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    ...(isSignup && {
      username: Yup.string().required("Username is required"),
    }),
    email: Yup.string().email("Invalid email").required("Email is Required"),
    password: Yup.string()
      .min(6, "Min 6 characters")
      .required("Password is Required"),
  });

  const handleClick = () => {
    isSignup ? navigate("/login") : navigate("/signup");
  }

  return (
    <VStack
      bg="rgba(255, 255, 255, 0.123)"
      backdropFilter="blur(20px)"
      sx={{
        WebkitBackdropFilter: "blur(12px)", // for Safari support
      }}
      border="1px solid white"
      w={{
        base: "80%",
        md: "60%",
        lg: "50%",
        lgx: "40%",
      }}
      h={{
        base: "60%",
        md: "70%",
      }}
      rounded="24px"
      boxShadow="12px 12px 6px rgba(0,0,0,0.1)"
      px={10}
      py={14}
      justifyContent="space-evenly"
      overflow="hidden"
    >
      <Box>
        <Heading
          fontSize={{
            base: "26px",
            md: "48px",
          }}
          fontWeight="bold"
          mb={4}
          color="brand.400"
        >
          {isSignup ? "Create Account" : "Login"}
        </Heading>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        gap={4}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={
            isSignup
              ? async (values, { setSubmitting }) => {
                  const user = await Firebase.createUser({
                    email: values.email,
                    password: values.password,
                    username: values.username,
                  });

                  if (user?.success === false) {
                    toast.error("Signup failed: " + user.error);
                  } else {
                    await firebaseUserdb.createUser(
                      {
                        username: values.username,
                        email: values.email,
                      },
                      user.uid,
                    );
                    await refreshUser();
                    toast.success("Signup successful!");
                  }

                  setSubmitting(false);
                }
              : async (values, { setSubmitting }) => {
                  const user = await Firebase.loginUser({
                    email: values.email,
                    password: values.password,
                  });

                  if (user?.success === false) {
                    toast.error("Login failed: " + user.error);
                  } else {
                    toast.success("Login successful!");
                  }

                  setSubmitting(false);
                }
          }
        >
          {({ errors, touched, isSubmitting, getFieldProps }) => (
            <Form
              style={{
                width: "100%",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <VStack w="100%" gap="30px">
                {isSignup && (
                  <>
                    <InputTab
                      {...getFieldProps("username")}
                      type="text"
                      w="100%"
                      placeholder="Enter username..."
                      startElement={<LuUserRound color="white" />}
                    />
                    {errors.username && touched.username && (
                      <Text
                        color="brand.200"
                        fontSize="sm"
                        mt="-7"
                        alignSelf="start"
                        ml="2"
                      >
                        {errors.username}
                      </Text>
                    )}
                  </>
                )}

                <InputTab
                  {...getFieldProps("email")}
                  type="email"
                  placeholder="Enter your email..."
                  startElement={<AiOutlineMail color="white" />}
                />
                {errors.email && touched.email && (
                  <Text
                    color="brand.200"
                    fontSize="sm"
                    mt="-7"
                    alignSelf="start"
                    ml="2"
                  >
                    {errors.email}
                  </Text>
                )}

                <InputTab
                  {...getFieldProps("password")}
                  type="password"
                  placeholder="Enter your password..."
                  startElement={<IoLockClosedOutline color="white" />}
                />
                {errors.password && touched.password && (
                  <Text
                    color="brand.200"
                    fontSize="sm"
                    mt="-7"
                    alignSelf="start"
                    ml="2"
                  >
                    {errors.password}
                  </Text>
                )}

                <SpinnerBtn
                  type="submit"
                  text={isSignup ? "Sign Up" : "Login"}
                  w={{
                    base: "200px",
                    md: "300px",
                  }}
                  h={{
                    base: "50px",
                    md: "62px",
                  }}
                  rounded="20px"
                  fontSize={{
                    base: "18px",
                    md: "26px",
                  }}
                  fontWeight="bold"
                  isLoading={isSubmitting}
                  isDisabled={isSubmitting}
                />
              </VStack>
            </Form>
          )}
        </Formik>
        <HStack gap={1}>
          <Text color="brand.400" fontSize="sm">
            {isSignup ? "Already have an account ?" : "Don't have an account ?"}
          </Text>
          <Text color="brand.50" fontSize="sm" onClick={handleClick} _hover={{textDecoration: "underline"}} cursor="pointer">
            {isSignup ? "Login" : "Sign Up"}
          </Text>
        </HStack>
      </Box>
    </VStack>
  );
};

export default AuthForm;
