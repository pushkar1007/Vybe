import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";

const SpinnerBtn = ({
  text,
  to = null,
  delay = 1000,
  onClick = null,
  type = "button",
  isLoading = false,
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = async (e) => {
    if (type === "submit") return;
    e.preventDefault();

    setLoading(true);

    setTimeout(async () => {
      setLoading(false);
      if (onClick) await onClick();
      if (to) navigate(to);
    }, delay);
  };

  return (
    <Button
      spinner={<BeatLoader size={8} color="black" />}
      onClick={handleClick}
      isDisabled={isLoading || loading}
      loading={isLoading || loading}
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
