import {
  Box,
  Dialog,
  Portal,
  Button,
  VStack,
  Stack,
  Image,
  Icon,
  CloseButton,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import { useRef, useState } from "react";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { uploadImage } from "@/utils/uploadImage";
import firebaseVybecirclesdb from "@/firebase/firebase.vybecirclesdb";
import firebaseUserdb from "@/firebase/firebase.userdb";
import ProfileIcon from "@/components/icons/ProfileIcon";
import ProfileInput from "../profile/ProfileInput";
import BioInput from "../profile/BioInput";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

const FileInputTrigger = ({ onClick }) => (
  <Box
    _hover={{ bg: "rgba(239, 93, 95, 0.111)" }}
    w="50px"
    h="50px"
    position="absolute"
    left="43%"
    top="7.5%"
    display="flex"
    alignItems="center"
    justifyContent="center"
    rounded="full"
    cursor="pointer"
    onClick={onClick}
  >
    <Icon
      as={MdOutlineAddAPhoto}
      position="absolute"
      color="brand.500"
      w="30px"
      h="30px"
    />
  </Box>
);

export const VybeCircleDialog = ({
  user,
  text = "",
  styling = {},
  vybeCircleData,
  onUpdate,
}) => {
  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { refreshUser } = useAuth();

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    try {
      const imageUrl = await uploadImage(file);

      const updateData = {};
      if (type === "logo") updateData.logo = imageUrl;
      if (type === "banner") updateData.banner = imageUrl;

      if (vybeCircleData?.vybecircleId) {
        await firebaseVybecirclesdb.updateVybecircle(
          updateData,
          vybeCircleData.vybecircleId,
        );

        if (onUpdate) onUpdate();
      } else {
        toast.warning("Can't update image without existing VybeCircle");
        console.warn("Can't update image without existing VybeCircle");
      }
    } catch (err) {
      console.error("Image upload or DB update failed:", err);
    }
  };

  const initialValues = {
    name: vybeCircleData?.name || "",
    description: vybeCircleData?.description || "",
    logo: vybeCircleData?.logo || null,
    banner: vybeCircleData?.banner || null,
  };

  const handleSubmit = async (values) => {
    try {
      if (!vybeCircleData) {
        const userId = user.uid;
        console.log(userId);
        values.logo = await uploadImage(values.logo);
        values.banner = await uploadImage(values.banner);
        const newVybe = await firebaseVybecirclesdb.createVybecircle(
          values,
          userId,
        );

        if (!newVybe?.id) {
          throw new Error("VybeCircle creation failed: missing ID");
        }

        await firebaseVybecirclesdb.addUser(userId, newVybe.id);
        await firebaseUserdb.addVybeCircle(newVybe.id, user);
        refreshUser();
      } else {
        if (typeof values.logo !== "string") {
          values.logo = await uploadImage(values.logo);
        }
        if (typeof values.banner !== "string") {
          values.banner = await uploadImage(values.banner);
        }

        await firebaseVybecirclesdb.updateVybecircle(
          values,
          vybeCircleData.vybecircleId,
        );
      }

      if (onUpdate) onUpdate();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating/updating VybeCircle:", error);
    }
  };

  return (
    <Dialog.Root
      closeOnInteractOutside={false}
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
    >
      <Dialog.Trigger asChild>
        <Button
          w="100%"
          fontSize="16px"
          fontWeight="400"
          p="3px"
          bg="white"
          color="black"
          outline="none"
          {...styling}
        >
          {text}
        </Button>
      </Dialog.Trigger>

      <Portal>
        <style>
          {`.vybe-textarea::placeholder { color: white; opacity: 0.7; }`}
        </style>

        <Dialog.Positioner>
          <Dialog.Backdrop />
          <Dialog.Content w="100%">
            <Box
              bg="#EF5D60"
              color="white"
              py={8}
              borderRadius="lg"
              w="100%"
              boxShadow="xl"
            >
              <Dialog.Header mb={6} px={8} fontSize="2xl" textAlign="center">
                {text} VybeCircle
              </Dialog.Header>

              <Dialog.Body w="full" p={0}>
                <Formik
                  initialValues={initialValues}
                  onSubmit={handleSubmit}
                  enableReinitialize
                >
                  {() => (
                    <Form style={{ width: "100%" }}>
                      <VStack w="100%">
                        <Stack position="relative" w="100%">
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            ref={avatarInputRef}
                            onChange={(e) => handleImageUpload(e, "logo")}
                          />
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            ref={bannerInputRef}
                            onChange={(e) => handleImageUpload(e, "banner")}
                          />

                          <Box
                            bg="brand.300"
                            w="full"
                            h="120px"
                            borderBottom="1px solid"
                            borderColor="brand.500"
                          >
                            {vybeCircleData?.banner && (
                              <Image
                                src={vybeCircleData.banner}
                                alt="Banner"
                                h="100%"
                                w="100%"
                                objectFit="cover"
                              />
                            )}
                            <FileInputTrigger
                              onClick={() => bannerInputRef.current?.click()}
                            />
                          </Box>

                          <Box
                            border="1px solid #000"
                            rounded="full"
                            h="100px"
                            w="100px"
                            bg="brand.400"
                            position="absolute"
                            top="70px"
                            left="20px"
                          >
                            {vybeCircleData?.logo ? (
                              <Image
                                src={vybeCircleData.logo}
                                alt="Profile"
                                boxSize="100px"
                                rounded="full"
                              />
                            ) : (
                              <Image as={ProfileIcon} />
                            )}
                            <Box
                              _hover={{ bg: "rgba(239, 93, 95, 0.111)" }}
                              w="50px"
                              h="50px"
                              position="absolute"
                              left="23px"
                              top="23px"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              rounded="full"
                              cursor="pointer"
                              onClick={() => avatarInputRef.current?.click()}
                            >
                              <Icon
                                as={MdOutlineAddAPhoto}
                                color="brand.500"
                                w="30px"
                                h="30px"
                              />
                            </Box>
                          </Box>
                          <Stack mt="50px" p={4} w="100%" gapY={6}>
                            <Field name="name">
                              {({ field, meta, form }) => (
                                <ProfileInput
                                  label="Name"
                                  value={field.value}
                                  onChange={(e) =>
                                    form.setFieldValue(
                                      field.name,
                                      e.target.value,
                                    )
                                  }
                                  name={field.name}
                                  error={
                                    meta.touched && meta.error
                                      ? meta.error
                                      : undefined
                                  }
                                />
                              )}
                            </Field>
                            <Field name="description">
                              {({ field, meta }) => (
                                <BioInput
                                  isVybCircle
                                  bio={field.value}
                                  handleChange={field.onChange("description")}
                                  error={
                                    meta.touched && meta.error
                                      ? meta.error
                                      : undefined
                                  }
                                />
                              )}
                            </Field>
                          </Stack>
                        </Stack>
                        <Button
                          type="submit"
                          color="#EF5D60"
                          bg="white"
                          _hover={{ bg: "#fefefe" }}
                        >
                          {vybeCircleData ? "Update" : "Create"}
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
                _hover={{ bg: "whiteAlpha.300", border: "1px solid white" }}
                rounded="full"
                onClick={() => setIsDialogOpen(false)}
              />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default VybeCircleDialog;
