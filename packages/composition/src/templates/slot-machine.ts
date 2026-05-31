import { staticFile } from "remotion";

import type { VideoComposition } from "@renda/shared/types/video-composition";

const LOGOS = [
  staticFile("logos/logo-1.svg"),
  staticFile("logos/logo-2.svg"),
  staticFile("logos/logo-3.svg"),
  staticFile("logos/logo-4.svg"),
];
const SCENE_DURATION = 180;
const STOP_AT_FRAME = 150;

export const SLOT_MACHINE_TEMPLATE: VideoComposition = {
  VideoTrack: [
    {
      id: "scene_slot_intro",
      type: "Scene",
      duration: SCENE_DURATION,
      components: [
        {
          id: "title_slot",
          type: "Text",
          content: "Spin the logos",
          animation: "",
          divStyles: {
            position: "absolute",
            top: 48,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          textStyles: {
            fontFamily: "Poppins, sans-serif",
            fontSize: 56,
            fontWeight: 800,
            color: "#0F172A",
            margin: 0,
            letterSpacing: -1,
          },
        },
        {
          id: "slot_reel_1",
          type: "SlotMachine",
          logos: LOGOS,
          finalIndex: 0,
          stopAtFrame: STOP_AT_FRAME,
          extraSpins: 5,
          divStyles: {
            position: "absolute",
            top: 160,
            left: 220,
            width: 240,
            height: 400,
            background: "#fff",
            border: "4px solid #0F172A",
            borderRadius: 24,
            boxShadow: "0 24px 60px rgba(15,23,42,0.25)",
          },
        },
        {
          id: "slot_reel_2",
          type: "SlotMachine",
          logos: LOGOS,
          finalIndex: 2,
          stopAtFrame: STOP_AT_FRAME + 20,
          extraSpins: 6,
          divStyles: {
            position: "absolute",
            top: 160,
            left: 520,
            width: 240,
            height: 400,
            background: "#fff",
            border: "4px solid #0F172A",
            borderRadius: 24,
            boxShadow: "0 24px 60px rgba(15,23,42,0.25)",
          },
        },
        {
          id: "slot_reel_3",
          type: "SlotMachine",
          logos: LOGOS,
          finalIndex: 3,
          stopAtFrame: STOP_AT_FRAME + 40,
          extraSpins: 7,
          divStyles: {
            position: "absolute",
            top: 160,
            left: 820,
            width: 240,
            height: 400,
            background: "#fff",
            border: "4px solid #0F172A",
            borderRadius: 24,
            boxShadow: "0 24px 60px rgba(15,23,42,0.25)",
          },
        },
      ],
    },
  ],
  AudioTrack: [],
};
