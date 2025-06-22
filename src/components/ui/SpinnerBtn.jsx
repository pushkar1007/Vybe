import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";

const SpinnerBtn = ({ text, ...props }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/profile");
    }, 1000);
  };

  return (
    <Button
      onClick={handleClick}
      isDisabled={loading}
      spinner={<BeatLoader size={8} color="black" />}
      loading={loading}
      spinnerPlacement="start"
      height="4opx"
      width="138px"
      mr="35px"
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
