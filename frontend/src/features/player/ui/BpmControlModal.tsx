import { usePlayerStore } from "../model/usePlayerStore";
import { bpmOptions, isValidBpm } from "../lib/bpmUtils";
import { useEffect, useState } from "react";
import { Modal } from "@/shared/ui/Modal"; // BaseModal이 Modal로 이름 변경되었다면
import { Button } from "@/shared/ui/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function BpmControlModal({ isOpen, onClose }: Props) {
  const { bpm, setBpm, resetBpm } = usePlayerStore();
  const [tempBpm, setTempBpm] = useState(bpm);

  // 모달 열릴 때마다 tempBpm 초기화
  useEffect(() => {
    if (isOpen) {
      setTempBpm(bpm);
    }
  }, [isOpen, bpm]);

  const handleApply = () => {
    if (isValidBpm(tempBpm)) {
      setBpm(tempBpm);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="BPM 설정">
      <div className="space-y-2">
        <input
          type="number"
          value={tempBpm}
          onChange={(e) => setTempBpm(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
        />
        <div className="flex gap-2 flex-wrap">
          {bpmOptions.map((option) => (
            <Button
              key={option}
              onClick={() => setTempBpm(option)}
              color={option === tempBpm ? "blue" : "light"}
            >
              {option}
            </Button>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button color="dark" onClick={resetBpm}>
            초기화
          </Button>
          <Button color="green" onClick={handleApply}>
            적용
          </Button>
        </div>
      </div>
    </Modal>
  );
}
