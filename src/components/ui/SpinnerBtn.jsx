import { Button } from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";

const SpinnerBtn = ({ text, ...props }) => {

  return (
    <Button
      spinner={<BeatLoader size={8} color="black" />}
      spinnerPlacement="start"
      height="4opx"
      width="138px"
      mr="50px"
      rounded="full"
      bg="white"
      color="black"
      boxShadow="4px 8px 4px rgba(0,0,0,0.1)"
      {...props}
    >
      {text}
    </Button>
  );
};

export default SpinnerBtn;
