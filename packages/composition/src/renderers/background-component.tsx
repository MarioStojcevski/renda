import type { BackgroundComponentType } from "@renda/shared/types/components/background-component";

type Props = BackgroundComponentType;

const BackgroundRenderer = ({ fill }: Props) => (
  <div style={{ width: "100%", height: "100%", background: fill }} />
);

export default BackgroundRenderer;
