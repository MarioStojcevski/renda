import type { TimedComponent } from "./timed-component";

export type Lane = {
  id: string;
  name: string;
  type: "video" | "audio";
  locked?: boolean;
  hidden?: boolean;
  components: TimedComponent[];
};
