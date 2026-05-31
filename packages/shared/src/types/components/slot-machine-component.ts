import { CSSProperties } from "react";

export type SlotMachineComponentType = {
  id: string;
  type: "SlotMachine";
  /** Public URLs of the SVG/PNG logos to spin through. */
  logos: string[];
  /** Index of the final logo to land on. */
  finalIndex: number;
  /** Frame at which the reel should be fully stopped (relative to scene). */
  stopAtFrame: number;
  /** Extra full revolutions before settling, for spin intensity. */
  extraSpins?: number;
  divStyles: CSSProperties;
  animation?: string;
};
