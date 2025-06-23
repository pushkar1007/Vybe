import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";

const SpinnerBtn = ({
  text,
  to = null,
  delay = 1000,
  onClick = null,
  type,
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = async (e) => {
    if (type === "submit") return;
    e.preventDefault();

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
      type={type}
      {...props}
    >
      {text}
    </Button>
  );
};

export default SpinnerBtn;
