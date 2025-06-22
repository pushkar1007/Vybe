"use client";

import { createIcon } from "@chakra-ui/react";

const CustomIcon = createIcon({
  displayName: "ProfileIcon",
  viewBox: "0 0 50 50",
  path: (
    <>
      <path
        fill="#000"
        d="M24.993 25.573a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM25 15a6 6 0 0 1 3.04 11.174c3.688 1.11 6.458 4.218 6.955 8.078.047.367-.226.7-.61.745-.383.045-.733-.215-.78-.582-.54-4.19-4.169-7.345-8.57-7.345-4.425 0-8.1 3.161-8.64 7.345-.047.367-.397.627-.78.582-.384-.045-.657-.378-.61-.745.496-3.844 3.281-6.948 6.975-8.068A6 6 0 0 1 25 15Z"
      />
    </>
  ),
});

const ProfileIcon = (props) => {
  return <CustomIcon {...props} />;
};

export default ProfileIcon;
