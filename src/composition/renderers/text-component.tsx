import type { TextComponentType } from "../../types/components/text-component";

type Props = TextComponentType;

const TextRenderer = ({ content, textStyles }: Props) => (
  <h1
    data-gramm="false"
    style={{
      margin: 0,
      padding: 0,
      width: "100%",
      height: "100%",
      whiteSpace: "pre-wrap",
      ...textStyles,
    }}
  >
    {content}
  </h1>
);

export default TextRenderer;
