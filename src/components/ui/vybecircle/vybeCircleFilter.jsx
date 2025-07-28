import { Menu, Button, Portal, Icon } from "@chakra-ui/react";
import { IoFilter } from "react-icons/io5";
export const VybeCircleFilter = ({ filterSetter }) => {
  const filterOptions = [
    { label: "most likes", value: "likes_desc" },
    { label: "most comments", value: "comments_desc" },
    { label: "newest", value: "time_desc" },
    { label: "oldest", value: "time_asc" },
  ];
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button
          bg="white"
          color="black"
          borderWidth="1px"
          borderColor="black"
          borderStyle="double"
          boxShadow="md"
        >
          <span>filter</span>
          <Icon
            as={IoFilter}
            color="brand.500"
            my={1}
            ml={"auto"}
            height={"90%"}
            cursor="pointer"
            fontSize={"32px"}
          />
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {filterOptions.map((option) => (
              <Menu.Item
                key={option.value}
                value={option.value}
                onClick={() => filterSetter(option.value)}
              >
                {option.label}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};
