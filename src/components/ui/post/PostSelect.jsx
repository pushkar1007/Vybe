"use client";

import {
  Portal,
  Select,
  Stack,
  createListCollection,
} from "@chakra-ui/react";

const PostSelect = () => {
  return (
    <Select.Root
      collection={frameworks}
      size="sm"
      width="220px"
      color="white"
      defaultValue={["everyone"]}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger zIndex="auto">
          <Select.ValueText placeholder="Select" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner style={{ zIndex: 3000, position: "fixed"}}>
          <Select.Content>
            {frameworks.items.map((framework) => (
              <Select.Item item={framework} key={framework.value}>
                <Stack gap="0">
                  <Select.ItemText>{framework.label}</Select.ItemText>
                </Stack>
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
};

export default PostSelect;

const frameworks = createListCollection({
  items: [
    {
      label: "Everyone",
      value: "everyone",
    },
    {
      label: "VybCircle",
      value: "vybcircle",
    },
  ],
});
