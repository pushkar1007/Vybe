import { Field, Input } from "@chakra-ui/react";


const ProfileInput = ({label, onChange, value,...props}) => {
  return (
    <Field.Root>
      <Field.Label
        position="absolute"
        color="brand.400"
        left="30px"
        top="-1px"
        bg="brand.500"
        zIndex="1"
        h="2px"
        display="flex"
        justifyContent="center"
        {...props}
      >
        {label}
      </Field.Label>
      <Input
        onChange={onChange}
        value={value}
        variant="unstyled"
        color="white"
        _placeholder={{
          color: "whiteAlpha.600",
          fontWeight: "normal",
        }}
        fontSize={{
          base: "sm",
          md: "md",
          lg: "lg",
        }}
        fontWeight="normal"
        border="1px solid white"
        borderRadius="xl"
        bg="whiteAlpha.300"
        px={4}
        py={2}
        backgroundClip="padding-box"
      />
    </Field.Root>
  );
};

export default ProfileInput;
