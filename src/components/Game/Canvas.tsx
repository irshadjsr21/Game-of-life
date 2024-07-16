import React from "react";
import { useWindowSize } from "~/hooks";

export interface CanvasProps {
  isStarted: boolean;
}

export const Canvas = React.forwardRef<HTMLCanvasElement, CanvasProps>(
  ({ isStarted }, ref) => {
    const windowSize = useWindowSize();

    const getSizeStyle = () => {
      if (!windowSize.width || !windowSize.height) return undefined;

      if (windowSize.width < windowSize.height) {
        return {
          height: `${windowSize.width - 50}px`,
          width: `${windowSize.width - 50}px`,
        };
      }

      return {
        height: `${windowSize.height - 200}px`,
        width: `${windowSize.height - 200}px`,
      };
    };

    return (
      <div className={`mb-4 mt-4 flex justify-center overflow-auto`}>
        <canvas
          ref={ref}
          style={getSizeStyle()}
          className={isStarted ? "cursor-not-allowed" : "cursor-pointer"}
        />
      </div>
    );
  }
);

Canvas.displayName = "Canvas";
