import { Button } from "../Button";
import { Slider } from "../Slider";

export interface ControlsProps {
  onRandom: () => void;
  drawingModesList: { id: string; name: string }[];
  drawingMode: string;
  onDrawingModeChange: (drawingMode: string) => void;
  onClear: () => void;
  onStartOrStop: () => void;
  isStarted: boolean;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  onRandom,
  drawingMode,
  drawingModesList,
  onDrawingModeChange,
  onClear,
  onStartOrStop,
  isStarted,
  speed,
  onSpeedChange,
}) => {
  return (
    <div className="flex items-center justify-center gap-4">
      <div className="flex flex-col">
        <p className="mr-2">Drawing Mode</p>
        {drawingModesList.map((mode) => (
          <div key={mode.id} className="flex">
            <input
              type="radio"
              id={mode.id}
              name="drawingMode"
              value={mode.id}
              onChange={(e) => {
                onDrawingModeChange(e.target.value);
              }}
              checked={drawingMode === mode.id}
              className="mr-2"
              disabled={isStarted}
            />
            <label htmlFor={mode.id}>{mode.name}</label>
          </div>
        ))}
      </div>
      <Button
        onClick={() => {
          onStartOrStop();
        }}
      >
        {isStarted ? "Stop" : "Start"}
      </Button>
      <Button onClick={onRandom} disabled={isStarted}>
        Random
      </Button>
      <Button onClick={onClear} disabled={isStarted}>
        Clear
      </Button>
      <Slider
        id={"speed"}
        name={"Speed"}
        value={speed}
        onChange={onSpeedChange}
        width={60}
        min={1}
        max={20}
      />
    </div>
  );
};
