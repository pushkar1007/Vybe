"use client";

import { useAuth } from "@/context/AuthContext";
import { Portal, Select, Stack, createListCollection } from "@chakra-ui/react";
import firebaseVybecirclesdb from "@/firebase/firebase.vybecirclesdb";
import { useEffect, useState } from "react";
import { isEqual } from "lodash";

const PostSelect = ({ targetSetter }) => {
  const { userData } = useAuth();
  //the frameworks is a state variable which will contain the various post select options
  const [frameworks, setFrameworks] = useState(
    createListCollection({
      items: [{ label: "Everyone", value: `${userData.id}` }],
    }),
  );

  async function fetchVybeCircles() {
    //if no vybecircles are in the user profile no need for further operations
    if (userData.vybecircles.length === 0) return;

    try {
      const fetchPromises = userData.vybecircles.map((circle) =>
        firebaseVybecirclesdb.getVybecircle(circle.id),
      );

      const fetchedCircles = await Promise.all(fetchPromises);
      const validCircles = fetchedCircles.filter(Boolean);

      //updating the frameworks
      const dynamicItems = validCircles.map((circle) => ({
        label: circle.name,
        value: circle.id,
      }));

      setFrameworks(
        createListCollection({
          items: [
            { label: "Everyone", value: `${userData.id}` },
            ...dynamicItems,
          ],
        }),
      );
    } catch (error) {
      console.error("Error fetching vybe circle data:", error);
    }
  }

  useEffect(() => {
    fetchVybeCircles();
  }, []);

  return (
    <Select.Root
      collection={frameworks}
      size="sm"
      width="220px"
      color="white"
      //default value of the post selection will be everyone
      defaultValue={[`${userData.id}`]}
      //updating the target upon value change, this change will be passed to the parent component
      onValueChange={(selected) => {
        const selectedValue = selected.items[0].value;
        const targetType =
          selectedValue === `${userData.id}` ? "user" : "vybecircle";
        targetSetter((prev) => {
          return isEqual(prev, { targetId: selectedValue, targetType })
            ? prev
            : { targetId: selectedValue, targetType };
        });
      }}
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
        <Select.Positioner style={{ zIndex: 3000, position: "fixed" }}>
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
