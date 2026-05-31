import { chakra, type StyleProps } from "@chakra-ui/react";

const Logo = (props: StyleProps) => (
  <chakra.img
    src="/logo.png"
    alt="rendalone."
    objectFit="contain"
    {...props}
  />
);

export default Logo;
