import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";

const SpinnerBtn = ({
  text,
  to = null,
  delay = 1000,
  onClick = null,
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = async () => {
    setLoading(true);

    if (onClick) await onClick();

    setTimeout(() => {
      setLoading(false);
      if (to) navigate(to);
    }, delay);
  };

  return (
    <Button
      spinner={<BeatLoader size={8} color="black" />}
      onClick={handleClick}
      isDisabled={loading}
      loading={loading}
      spinnerPlacement="start"
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
