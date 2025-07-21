import {
  Box,
  Dialog,
  Portal,
  Button,
  Input,
  Textarea,
   CloseButton,
  VStack,
  Text,
} from "@chakra-ui/react";
import firebaseVybecirclesdb from "@/firebase/firebase.vybecirclesdb";
import { Formik, Field, Form } from "formik";
import { uploadImage } from "@/utils/uploadImage";
import * as Yup from "yup";
import { isBoolean } from "lodash";
import { useEffect } from "react";

export const VybeCircleDialog = ({user}) => {

  const initialValues = {
    name: "",
    description: "",
    logo: null,
    banner: null,
  };

  const validationSchema = Yup.object({
    name: Yup.string().min(5,"the name must be atllease 5 characters long").required("name Required"),
    description: Yup.string().min(10,"the name must be atllease 5 characters long").required("description Required"),
    logo: Yup.mixed().required("logo Required"),
    banner: Yup.mixed().nullable().notRequired(),
  });

  const style = `
    .vybe-textarea::placeholder {
      color: white;
      opacity: 0.7;
    }
  `;

    const handleClose = () => {
  };



  const handleSubmit = async (values) => {
    try {
        const userId = user.uid
        console.log(values)
        console.log(typeof values.logo)
        values.logo = await uploadImage(values.logo)
        values.banner = await uploadImage(values.banner)
        console.log(values)
        await firebaseVybecirclesdb.createVybecircle(values,userId)
    } catch (error) {
        console.error("error creating vybeCircle",error)
    }
  };

  return (
    <>
      <Dialog.Root closeOnInteractOutside={false}>
        <Dialog.Trigger asChild>
          <Button
            bg="brand.400"
            color="brand.200"
            boxShadow="4px 8px 4px rgba(0,0,0,0.1)"
            mt="12px"
            fontSize="16px"
            fontWeight="bold"
            rounded="full"
            height="4opx"
            width={{
              base: "138px",
              md: "90px",
              lg: "120px",
              lgx: "120px",
              xl: "138px",
            }}
            mr={{
              base: "50px",
              md: "10px",
              lg: "40px",
              lgx: "40px",
              xl: "50px",
            }}
          >
            Create
          </Button>
        </Dialog.Trigger>
        <Portal>
          <style>{style}</style>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Box
                bg="#EF5D60"
                color="white"
                p={8}
                borderRadius="lg"
                maxW="lg"
                mx="auto"
                m={0}
                boxShadow="xl"
                rounded={4}
              >
                <Dialog.Header mb={6} fontSize="2xl" textAlign="center">
                  Create a VybeCircle
                </Dialog.Header>

                <Dialog.Body>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ setFieldValue, errors, touched }) => (
                      <Form>
                        <VStack spacing={4}>
                          <Field name="name">
                            {({ field }) => (
                              <Box w="100%">
                                <Input
                                  {...field}
                                  placeholder="Enter VybeCircle name"
                                  bg="white"
                                  color="#EF5D60"
                                />
                                {touched.name && errors.name && (
                                  <Text fontSize="sm" color="white" mt={1}>
                                    {errors.name}
                                  </Text>
                                )}
                              </Box>
                            )}
                          </Field>

                          <Field name="description">
                            {({ field }) => (
                              <Box w="100%">
                                <Textarea
                                  {...field}
                                  placeholder="Describe your VybeCircle"
                                  bg="white"
                                  color="#EF5D60"
                                />
                                {touched.description && errors.description && (
                                  <Text fontSize="sm" color="white" mt={1}>
                                    {errors.description}
                                  </Text>
                                )}
                              </Box>
                            )}
                          </Field>

                          <Box w="100%">
                            <Input
                              type="file"
                              accept="image/*"
                              bg="white"
                              color="#EF5D60"
                              pt={1}
                              onChange={(event) =>
                                setFieldValue(
                                  "logo",
                                  event.currentTarget.files[0],
                                )
                              }
                            />
                            {touched.logo && errors.logo && (
                              <Text fontSize="sm" color="white" mt={1}>
                                {errors.logo}
                              </Text>
                            )}
                          </Box>

                          <Box w="100%">
                            <Input
                              type="file"
                              accept="image/*"
                              bg="white"
                              color="#EF5D60"
                              pt={1}
                              onChange={(event) =>
                                setFieldValue(
                                  "banner",
                                  event.currentTarget.files[0],
                                )
                              }
                            />
                            {touched.banner && errors.banner && (
                              <Text fontSize="sm" color="white" mt={1}>
                                {errors.banner}
                              </Text>
                            )}
                          </Box>

                          <Button
                            type="submit"
                            color="#EF5D60"
                            bg="white"
                            _hover={{ bg: "#fefefe" }}
                          >
                            Create
                          </Button>
                        </VStack>
                      </Form>
                    )}
                  </Formik>
                </Dialog.Body>
              </Box>
              <Dialog.CloseTrigger asChild>
                            <CloseButton
                              size="lg"
                              color="brand.400"
                              _hover={{
                                bg: "whiteAlpha.300",
                                border: "1px solid white",
                              }}
                              rounded="full"
                              onClick={handleClose}
                            />
                          </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};
