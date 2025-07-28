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
import firebaseUserdb from "@/firebase/firebase.userdb";

//this is the dialog used in creating a vybe circle and  in editing also in the future
export const VybeCircleDialog = ({
  user,
  text = "",
  styling = {},
  vybeCircleData,
}) => {
  const initialValues = vybeCircleData
    ? {
        name: vybeCircleData.name,
        description: vybeCircleData.description,
        logo: vybeCircleData.logo,
        banner: vybeCircleData.banner,
      }
    : {
        name: "",
        description: "",
        logo: null,
        banner: null,
      };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(5, "the name must be atllease 5 characters long")
      .required("name Required"),
    description: Yup.string()
      .min(10, "the name must be atllease 5 characters long")
      .required("description Required"),
    logo: Yup.mixed().required("logo Required"),
    banner: Yup.mixed().nullable().notRequired(),
  });

  const style = `
    .vybe-textarea::placeholder {
      color: white;
      opacity: 0.7;
    }
  `;

  const handleSubmit = async (values) => {
    try {
      if (!vybeCircleData) {
        const userId = user.uid;
        values.logo = await uploadImage(values.logo);
        values.banner = await uploadImage(values.banner);
        const vybeCircledata = await firebaseVybecirclesdb.createVybecircle(
          values,
          userId,
        );
        await firebaseVybecirclesdb.addUser(userId, vybeCircledata.id);
        await firebaseUserdb.addVybeCircle(vybeCircledata.id, user);
      } else {
        if (typeof values.logo != "string" && values.logo) {
          values.logo = await uploadImage(values.logo);
        }
        if (typeof values.banner != "string" && values.banner) {
          values.banner = await uploadImage(values.banner);
        }
        //if the user has uploaded a file then the link must be generated
        await firebaseVybecirclesdb.updateVybecircle(values, vybeCircleData.id);
        console.log(values, vybeCircleData.id);
      }
    } catch (error) {
      console.error("error creating vybeCircle", error);
    }
  };

  return (
    <>
      <Dialog.Root closeOnInteractOutside={false}>
        <Dialog.Trigger asChild>
          <Button
            w={"100%"}
            p={"4px"}
            bg={"white"}
            color={"black"}
            outlineStyle={"none"}
            {...styling}
          >
            {text}
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
                  {text} VybeCircle
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
                            {vybeCircleData?.logo ? (
                              <img
                                width="64px"
                                height="64px"
                                src={`${vybeCircleData.logo}`}
                              />
                            ) : null}
                            <>
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
                            </>
                          </Box>

                          <Box w="100%">
                            {vybeCircleData?.banner ? (
                              <img src={`${vybeCircleData.banner}`} />
                            ) : null}
                            <>
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
                            </>
                          </Box>

                          <Button
                            type="submit"
                            color="#EF5D60"
                            bg="white"
                            _hover={{ bg: "#fefefe" }}
                          >
                            {vybeCircleData ? "update" : "create"}
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
                />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};
