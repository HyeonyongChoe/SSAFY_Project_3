import { useInstrumentStore } from "../model/useInstrumentStore";
import { Select } from "@/shared/ui/Select";

interface InstrumentDropdownProps {
  className?: string;
}

const instruments = [
  "Piano",
  "Vocal",
  "Bass",
  "Guitar",
  "Drums",
];

export function InstrumentDropdown({ className }: InstrumentDropdownProps) {
  const { selected, setInstrument } = useInstrumentStore();

  return (
    <Select
      value={selected}
      onChange={(e) => setInstrument(e.target.value)}
      className={className}
    >
      {instruments.map((instrument) => (
        <option key={instrument} value={instrument}>
          {instrument}
        </option>
      ))}
    </Select>
  );
}
