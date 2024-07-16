import { Button } from "../ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "../ui/select";
import { Slider } from "../ui/slider";

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
  onNextGeneration: () => void;
  generation: number;
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
  onNextGeneration,
  generation,
}) => {
  return (
    <div className="mx-2 flex flex-wrap items-center justify-center gap-4">
      <Select
        value={drawingMode}
        onValueChange={onDrawingModeChange}
        disabled={isStarted}
        name="drawingMode"
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select drawing mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Drawing Mode</SelectLabel>
            {drawingModesList.map((mode) => (
              <SelectItem key={mode.id} value={mode.id}>
                {mode.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button
        onClick={() => {
          onStartOrStop();
        }}
      >
        {isStarted ? "Stop" : "Start"}
      </Button>
      <Button onClick={onNextGeneration} disabled={isStarted}>
        Next ({generation})
      </Button>
      <Button onClick={onRandom} disabled={isStarted}>
        Random
      </Button>
      <Button onClick={onClear} disabled={isStarted}>
        Clear
      </Button>
      <div className="flex flex-col">
        <p className="mb-2 text-sm">Speed</p>
        <Slider
          name={"speed"}
          value={[speed]}
          onValueChange={(v) => onSpeedChange(v[0] ?? 0)}
          className="w-[100px]"
          min={1}
          max={40}
        />
      </div>
    </div>
  );
};
