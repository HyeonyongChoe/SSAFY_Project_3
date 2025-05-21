import { ChromePicker } from "react-color";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  return (
    <div className="rounded shadow-md border bg-white p-2">
      <ChromePicker
        color={color}
        onChange={(updatedColor) => {
          onChange(updatedColor.hex);
        }}
        disableAlpha
      />
    </div>
  );
}
