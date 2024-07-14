export interface SliderProps {
  id: string;
  name: string;
  value: number;
  onChange: (value: number) => void;
  width?: number;
  disabled?: boolean;
  min?: number;
  max?: number;
}

export const Slider: React.FC<SliderProps> = ({
  id,
  onChange,
  value,
  width,
  name,
  disabled,
  min,
  max,
}) => {
  return (
    <div className={width ? `w-${width}px` : ""}>
      <label htmlFor={id} className="mb-1 block text-sm">
        {name}
      </label>
      <input
        id={id}
        type="range"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
        disabled={disabled}
        min={min}
        max={max}
      />
    </div>
  );
};
