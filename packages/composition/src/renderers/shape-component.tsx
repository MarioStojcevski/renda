import type { ShapeComponentType } from "@renda/shared/types/components/shape-component";

type Props = ShapeComponentType;

const ShapeRenderer = ({ shape, fill, stroke, strokeWidth }: Props) => {
  const base: React.CSSProperties = {
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
  };

  if (shape === "ellipse") {
    return (
      <div
        style={{
          ...base,
          background: fill,
          border: `${strokeWidth}px solid ${stroke}`,
          borderRadius: "50%",
        }}
      />
    );
  }

  if (shape === "line") {
    return (
      <div
        style={{
          ...base,
          background: stroke,
          borderRadius: strokeWidth,
        }}
      />
    );
  }

  return (
    <div
      style={{
        ...base,
        background: fill,
        border: `${strokeWidth}px solid ${stroke}`,
        borderRadius: 4,
      }}
    />
  );
};

export default ShapeRenderer;
