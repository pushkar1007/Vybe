import { Heading, VStack, Text } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputTab from "./InputTab";
import { LuUserRound } from "react-icons/lu";
import { AiOutlineMail } from "react-icons/ai";
import { IoLockClosedOutline } from "react-icons/io5";
import SpinnerBtn from "./SpinnerBtn";
import Firebase from "@/firebase/firebase.auth";
import { toast } from "react-toastify";

const AuthForm = ({ mode }) => {
  const isSignup = mode === "signup";

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

  return (
    <VStack
      bg="brand.500"
      w="40%"
      h="70%"
      rounded="24px"
      boxShadow="12px 12px 6px rgba(0,0,0,0.1)"
      px={10}
      py={14}
    >
      <Heading fontSize="48px" fontWeight="bold" mb={4} color="brand.400">
        {isSignup ? "Sign Up" : "Login"}
      </Heading>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={
          isSignup
            ? async (values, { setSubmitting }) => {
                const user = await Firebase.createUser({
                  email: values.email,
                  password: values.password,
                });

                if (user?.success === false) {
                  toast.error("Signup failed: " + user.error);
                } else {
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
            <VStack gap="30px" mt="20px">
              {isSignup && (
                <>
                  <InputTab
                    {...getFieldProps("username")}
                    type="text"
                    placeholder="Enter username..."
                    startElement={<LuUserRound color="black" />}
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
                startElement={<AiOutlineMail color="black" />}
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
                startElement={<IoLockClosedOutline color="black" />}
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
                w="300px"
                h="62px"
                rounded="20px"
                fontSize="26px"
                fontWeight="bold"
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
              />
            </VStack>
          </Form>
        )}
      </Formik>
    </VStack>
  );
};

export default AuthForm;
