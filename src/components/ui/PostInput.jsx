import { Box, Field, HStack, Input, Stack, Textarea } from "@chakra-ui/react";
import ProfileIcon from "../icons/ProfileIcon";

const PostInput = () => {
    return (
      <HStack w="100%">
        <Box w="50px" h="50px" rounded="full" border="1px solid black">
          <ProfileIcon />
        </Box>
        <Stack>
          <Field.Root>
            <Textarea name="post" placeholder="What's Vybe for Today?" />
          </Field.Root>
        </Stack>
      </HStack>
    );
}

export default PostInput;