import { staticFile } from "remotion";

import { FPS } from "@renda/shared/lib/video";
import type { VideoComposition } from "@renda/shared/types/video-composition";

const DURATION = FPS * 5;

export const SLOT_MACHINE_TEMPLATE: VideoComposition = {
  lanes: [
    {
      id: "lane_bg",
      name: "Background",
      type: "video",
      components: [
        {
          id: "bg_white",
          type: "Background",
          startFrame: 0,
          duration: DURATION,
          fill: "#ffffff",
          divStyles: {
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          },
        },
      ],
    },
    {
      id: "lane_shape",
      name: "Shape",
      type: "video",
      components: [
        {
          id: "shape_bounce",
          type: "Shape",
          startFrame: 0,
          duration: DURATION,
          shape: "rectangle",
          fill: "#6366f1",
          stroke: "#4338ca",
          strokeWidth: 3,
          divStyles: {
            position: "absolute",
            left: 860,
            top: 440,
            width: 200,
            height: 200,
            borderRadius: "24px",
          },
          keyframes: [
            {
              id: "shape_in",
              frame: 0,
              divStyles: { opacity: "0", transform: "scale(0.3) rotate(-20deg)" },
            },
            {
              id: "shape_mid",
              frame: FPS * 0.5,
              divStyles: { opacity: "1", transform: "scale(1.1) rotate(3deg)" },
            },
            {
              id: "shape_hold",
              frame: FPS * 4,
              divStyles: { opacity: "1", transform: "scale(1) rotate(0deg)" },
            },
            {
              id: "shape_out",
              frame: DURATION - 1,
              divStyles: { opacity: "0", transform: "scale(0.5) rotate(15deg)" },
            },
          ],
        },
      ],
    },
    {
      id: "lane_text",
      name: "Text",
      type: "video",
      components: [
        {
          id: "text_hello",
          type: "Text",
          startFrame: 0,
          duration: DURATION,
          content: "Renda",
          animation: "",
          textStyles: {
            fontFamily: "Poppins, sans-serif",
            fontSize: 96,
            fontWeight: 800,
            color: "#0F172A",
            margin: 0,
            letterSpacing: -2,
            textAlign: "center",
          },
          divStyles: {
            position: "absolute",
            top: 240,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          keyframes: [
            {
              id: "text_in",
              frame: 0,
              divStyles: { opacity: "0", transform: "translateY(-60px)" },
            },
            {
              id: "text_bounce",
              frame: FPS * 1,
              divStyles: { opacity: "1", transform: "translateY(0)" },
            },
            {
              id: "text_fade",
              frame: FPS * 4,
              divStyles: { opacity: "1", transform: "translateY(0)" },
            },
            {
              id: "text_out",
              frame: DURATION - 1,
              divStyles: { opacity: "0", transform: "translateY(40px)" },
            },
          ],
        },
      ],
    },
    {
      id: "lane_video",
      name: "Video",
      type: "video",
      components: [
        {
          id: "vid_sample",
          type: "Video",
          startFrame: FPS * 0.5,
          duration: FPS * 4,
          src: staticFile("sample.mp4"),
          animation: "",
          divStyles: {
            position: "absolute",
            left: 160,
            top: 540,
            width: 320,
            height: 180,
            borderRadius: "12px",
            overflow: "hidden",
          },
          keyframes: [
            {
              id: "vid_in",
              frame: FPS * 0.5,
              divStyles: { opacity: "0", transform: "translateX(-40px)" },
            },
            {
              id: "vid_show",
              frame: FPS * 1.5,
              divStyles: { opacity: "1", transform: "translateX(0)" },
            },
            {
              id: "vid_hide",
              frame: FPS * 4.5,
              divStyles: { opacity: "1", transform: "translateX(0)" },
            },
            {
              id: "vid_end",
              frame: DURATION - 1,
              divStyles: { opacity: "0", transform: "translateX(40px)" },
            },
          ],
        },
      ],
    },
  ],
};
