import { Icon, type IconProps } from "@chakra-ui/react";

type Props = IconProps;

export const SkipToStartIcon = (props: Props) => (
  <Icon viewBox="0 0 24 24" fill="currentColor" {...props}>
    <rect x="4" y="5" width="2.5" height="14" rx="1" />
    <path d="M18.5 12 9.5 6.25v11.5L18.5 12z" />
  </Icon>
);

export const SkipToEndIcon = (props: Props) => (
  <Icon viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M5.5 12 14.5 6.25v11.5L5.5 12z" />
    <rect x="17.5" y="5" width="2.5" height="14" rx="1" />
  </Icon>
);

export const PlayIcon = (props: Props) => (
  <Icon viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M8.5 5.8c0-1.2 1.3-1.9 2.3-1.3l9.8 5.7c1 .6 1 2 0 2.6l-9.8 5.7c-1 .6-2.3-.1-2.3-1.3V5.8z" />
  </Icon>
);

export const PauseIcon = (props: Props) => (
  <Icon viewBox="0 0 24 24" fill="currentColor" {...props}>
    <rect x="6" y="5" width="4" height="14" rx="1.2" />
    <rect x="14" y="5" width="4" height="14" rx="1.2" />
  </Icon>
);

export const ZoomOutIcon = (props: Props) => (
  <Icon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4.5 4.5" />
    <path d="M8 11h6" />
  </Icon>
);

export const ZoomInIcon = (props: Props) => (
  <Icon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4.5 4.5" />
    <path d="M8 11h6" />
    <path d="M11 8v6" />
  </Icon>
);
