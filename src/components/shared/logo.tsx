import { chakra, type StyleProps } from "@chakra-ui/react";

/** Play triangle with a center-bound slice on the left edge and softly blunted corners. */
export const LOGO_PATH =
  "M11 7Q10 6.2 10 7.6V12L14.2 16L10 20v4.4Q10 25.8 11.1 25.9L24.6 16.4Q25.7 16 24.6 15.6L11 7Z";

const Logo = (props: StyleProps) => (
  <chakra.svg
    viewBox="0 0 32 32"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="renda"
    {...props}
  >
    <path d={LOGO_PATH} />
  </chakra.svg>
);

export default Logo;
