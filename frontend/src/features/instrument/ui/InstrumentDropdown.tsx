import { useInstrumentStore } from "../model/useInstrumentStore";
import { Select } from "@/shared/ui/Select";

const instruments = [
  "Piano",
  "Violin",
  "Flute",
  "Guitar",
  "Drums",
  "Saxophone",
];

export function InstrumentDropdown() {
  const { selected, setInstrument } = useInstrumentStore();

  return (
    <Select value={selected} onChange={(e) => setInstrument(e.target.value)}>
      {instruments.map((instrument) => (
        <option key={instrument} value={instrument}>
          {instrument}
        </option>
      ))}
    </Select>
  );
}
