import { Stack } from "@chakra-ui/react";
import PostInput from "./PostInput";

const PostFeed = () => {
    return (
        <Stack overflow="auto">
            <PostInput />
        </Stack>
    );
}

export default PostFeed;