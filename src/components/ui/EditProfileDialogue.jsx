import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  Stack,
  Box,
  Image,
  Text,
  Input,
  Field,
  Icon,
} from "@chakra-ui/react";
import SpinnerBtn from "./SpinnerBtn";
import { useAuth } from "@/context/AuthContext";
import ProfileIcon from "../icons/ProfileIcon";
import ProfileInput from "./ProfileInput";
import { useRef, useState } from "react";
import firebaseUserdb from "@/firebase/firebase.userdb";
import BioInput from "./BioInput";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { uploadImage } from "@/utils/uploadImage";

const MAX_CHAR_LIMIT = 550;

const EditProfileDialogue = () => {
  const { user, userData, refreshUser } = useAuth();
  const [name, setName] = useState(userData?.handlename || "");
  const [username, setUsername] = useState(userData?.username || "");
  const [dob, setDob] = useState(userData?.dob || "");
  const [bio, setBio] = useState(userData?.bio || "");

  const avatarInputRef = useRef(null); 
  const bannerInputRef = useRef(null); 
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      await firebaseUserdb.updateUserCredentials(type, imageUrl, user);
      await refreshUser();
    } catch (err) {
      console.error("Cloudinary upload failed:", err.message);
    }
    setUploading(false);
  };

  const handleChange = (e) => {
    const newValue = e.target.value;

    if (newValue.length <= MAX_CHAR_LIMIT) {
      setBio(newValue);
    }
  };

  const handleSave = async () => {
    try {
      await firebaseUserdb.updateUserCredentials("handlename", name, user);
      await firebaseUserdb.updateUserCredentials("username", username, user);
      await firebaseUserdb.updateUserCredentials("bio", bio, user);
      await firebaseUserdb.updateUserCredentials("DOB", dob, user);
      await refreshUser();
      console.log("Saving:", { name, username, dob, bio });
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  const style = `
  .bio::placeholder {
    color: white;
    opacity: 0.7;
  }
`;

  return (
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
          width="120px"
          border="1px solid #EF5D60"
        >
          Edit Profile
        </Button>
      </Dialog.Trigger>
      <Portal>
        <style>{style}</style>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="brand.500">
            <Dialog.Header justifyContent="space-between" px={7} my={4}>
              <Dialog.Title fontSize="2xl" color="brand.400">
                Edit Profile
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body p={0}>
              <Stack position="relative">
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={avatarInputRef}
                  onChange={(e) => handleImageUpload(e, "avatar")}
                />
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
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
                  {userData?.banner && (
                    <Image
                      src={userData.banner}
                      alt="Banner"
                      h="100%"
                      w="100%"
                      objectFit="cover"
                    />
                  )}
                  <Box
                    _hover={{
                      bg: "rgba(239, 93, 95, 0.111)",
                    }}
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
                    onClick={() => bannerInputRef.current?.click()}
                  >
                    <Icon
                      as={MdOutlineAddAPhoto}
                      position="absolute"
                      color="brand.500"
                      w="30px"
                      h="30px"
                    />
                  </Box>
                </Box>
                <Box
                  border="1px solid #000000"
                  rounded="full"
                  h="100px"
                  w="100px"
                  position="absolute"
                  bg="brand.400"
                  top="70px"
                  left="20px"
                >
                  {userData?.avatar ? (
                    <Image
                      src={userData.avatar}
                      alt="Profile"
                      boxSize="100px"
                    />
                  ) : (
                    <Image as={ProfileIcon} />
                  )}
                  <Box
                    _hover={{
                      bg: "rgba(239, 93, 95, 0.111)",
                    }}
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
                      position="absolute"
                      color="brand.500"
                      w="30px"
                      h="30px"
                    />
                  </Box>
                </Box>
                <Stack mt="50px" p={4} position="relative" gap="15px">
                  <ProfileInput
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    w="50px"
                  />
                  <ProfileInput
                    label="UserName"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    w="82px"
                  />
                  <BioInput bio={bio} handleChange={handleChange} />
                  <Field.Root>
                    <Field.Label
                      position="absolute"
                      color="white"
                      top="-1px"
                      left="30px"
                      zIndex="1"
                      h="2px"
                      bg="brand.500"
                      w="42px"
                      display="flex"
                      justifyContent="center"
                    >
                      DOB
                    </Field.Label>
                    <Input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      placeholder={dob ? "" : userData?.DOB || "dd-mm-yyyy"}
                      bg="whiteAlpha.200"
                      color={"brand.400"}
                      w="200px"
                      borderRadius="8px"
                      border="1px solid white"
                    />
                  </Field.Root>
                </Stack>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <SpinnerBtn
                  text="Save"
                  rounded="full"
                  w="120px"
                  h="40px"
                  fontSize="16px"
                  fontWeight="bold"
                  onClick={handleSave}
                />
              </Dialog.ActionTrigger>
            </Dialog.Footer>
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
  );
};

export default EditProfileDialogue;
