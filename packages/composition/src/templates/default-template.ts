import { staticFile } from "remotion";

import { FPS } from "@renda/shared/lib/video";
import type { VideoComposition } from "@renda/shared/types/video-composition";

const DURATION = FPS * 8;

/** Simple starter project shown when the editor opens. */
export const DEFAULT_TEMPLATE: VideoComposition = {
  lanes: [
    {
      id: "lane_bg",
      name: "Background",
      type: "video",
      components: [
        {
          id: "bg_dark",
          type: "Background",
          startFrame: 0,
          duration: DURATION,
          fill: "#0f172a",
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
      id: "lane_text",
      name: "Title",
      type: "video",
      components: [
        {
          id: "text_title",
          type: "Text",
          startFrame: 0,
          duration: DURATION,
          content: "rendalone.",
          animation: "",
          textStyles: {
            fontFamily: "Poppins, sans-serif",
            fontSize: 72,
            fontWeight: 700,
            color: "#f8fafc",
            margin: 0,
            letterSpacing: -1,
            textAlign: "center",
          },
          divStyles: {
            position: "absolute",
            top: 320,
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
              divStyles: { opacity: "0", transform: "translateY(40px)" },
            },
            {
              id: "text_hold",
              frame: FPS,
              divStyles: { opacity: "1", transform: "translateY(0)" },
            },
            {
              id: "text_out",
              frame: DURATION - FPS,
              divStyles: { opacity: "1", transform: "translateY(0)" },
            },
            {
              id: "text_end",
              frame: DURATION - 1,
              divStyles: { opacity: "0", transform: "translateY(-20px)" },
            },
          ],
        },
      ],
    },
    {
      id: "lane_shape",
      name: "Accent",
      type: "video",
      components: [
        {
          id: "shape_accent",
          type: "Shape",
          startFrame: FPS * 0.5,
          duration: DURATION - FPS * 0.5,
          shape: "rectangle",
          fill: "#14b8a6",
          stroke: "#0f766e",
          strokeWidth: 0,
          divStyles: {
            position: "absolute",
            left: 760,
            top: 520,
            width: 400,
            height: 8,
            borderRadius: "999px",
          },
          keyframes: [
            { id: "shape_in", frame: 0, divStyles: { opacity: "0", width: "0px" } },
            { id: "shape_show", frame: FPS * 0.5, divStyles: { opacity: "1", width: "400px" } },
          ],
        },
      ],
    },
    {
      id: "lane_logo",
      name: "Logo",
      type: "video",
      components: [
        {
          id: "logo_mark",
          type: "Image",
          startFrame: FPS,
          duration: DURATION - FPS,
          src: staticFile("logo.png"),
          name: "rendalone.",
          animation: "",
          divStyles: {
            position: "absolute",
            left: 860,
            top: 180,
            width: 200,
            height: 200,
          },
          imageStyles: {
            width: "100%",
            height: "100%",
            objectFit: "contain",
          },
          keyframes: [
            { id: "logo_in", frame: 0, divStyles: { opacity: "0", transform: "scale(0.7)" } },
            { id: "logo_show", frame: FPS * 0.75, divStyles: { opacity: "1", transform: "scale(1)" } },
          ],
        },
      ],
    },
  ],
};
