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
  onReset: () => void;
  onStartOrStop: () => void;
  isStarted: boolean;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onNextGeneration: () => void;
  generation: number;
  isStartingBoard: boolean;
  isEmpty: boolean;
  boardSize: number;
  onBoardSizeChange: (boardSize: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  onRandom,
  drawingMode,
  drawingModesList,
  onDrawingModeChange,
  onClear,
  onReset,
  onStartOrStop,
  isStarted,
  speed,
  onSpeedChange,
  onNextGeneration,
  generation,
  isStartingBoard,
  isEmpty,
  boardSize,
  onBoardSizeChange,
}) => {
  return (
    <div className="mx-2 flex flex-col items-center justify-center">
      <p className="mb-1">Generation: {generation}</p>
      <div className="flex flex-wrap items-center justify-center gap-4">
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
        <Button onClick={onRandom} disabled={isStarted}>
          Random
        </Button>
        <Button
          onClick={() => {
            onStartOrStop();
          }}
          disabled={isEmpty}
        >
          {isStarted ? "Stop" : "Start"}
        </Button>
        <Button onClick={onNextGeneration} disabled={isStarted || isEmpty}>
          Next
        </Button>
        {isStartingBoard ? (
          <Button onClick={onClear} disabled={isStarted || isEmpty}>
            Clear
          </Button>
        ) : (
          <Button onClick={onReset} disabled={isStarted}>
            Reset
          </Button>
        )}
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
        <div className="flex flex-col">
          <p className="mb-2 text-sm">Board Size</p>
          <Slider
            name={"boardSize"}
            value={[boardSize]}
            onValueChange={(v) => onBoardSizeChange(v[0] ?? 30)}
            className="w-[100px]"
            min={1}
            max={50}
            disabled={isStarted}
          />
        </div>
      </div>
    </div>
  );
};
