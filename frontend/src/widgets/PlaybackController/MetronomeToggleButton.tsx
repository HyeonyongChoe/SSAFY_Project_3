import { useMetronomeStore } from "@/features/metronome/model/useMetronomeStore";
import { Button } from "@/shared/ui/Button";

export function MetronomeToggleButton() {
  const { isEnabled, toggle } = useMetronomeStore();

  return (
    <Button variant={isEnabled ? "primary" : "secondary"} onClick={toggle}>
      {isEnabled ? "🎵 메트로놈 ON" : "🔇 메트로놈 OFF"}
    </Button>
  );
}
