// src/features/instrument/ui/InstrumentDropdown.tsx
import { useInstrumentStore } from "@/features/instrument/model/useInstrumentStore";
import { useEffect } from "react";

interface InstrumentDropdownProps {
  parts: string[];
  className?: string;
}

export function InstrumentDropdown({
  parts = [],
  className,
}: InstrumentDropdownProps) {
  const { selected, setInstrument } = useInstrumentStore();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedInstrument = e.target.value;
    setInstrument(selectedInstrument);
    console.log("🎯 악기 선택됨:", selectedInstrument);
  };

  useEffect(() => {
    console.log("🎼 InstrumentDropdown - 받은 parts:", parts);
    // 추가 디버깅: 배열이 비어있는지 확인
    if (!parts || parts.length === 0) {
      console.warn("⚠️ InstrumentDropdown - parts 배열이 비어있습니다.");
    }

    // props가 제대로 전달되었는지 확인하기 위한 타입 체크
    console.log(
      "🔍 InstrumentDropdown - parts의 타입:",
      Array.isArray(parts) ? "Array" : typeof parts
    );
  }, [parts]);

  // 첫 번째 파트를 자동으로 선택하는 기능 추가
  useEffect(() => {
    if (parts && parts.length > 0 && !selected) {
      setInstrument(parts[0]);
      console.log("🎯 기본 악기 자동 선택:", parts[0]);
    }
  }, [parts, selected, setInstrument]);

  console.log("🔍 InstrumentDropdown 렌더링 시점의 parts:", parts);
  console.log("🔍 현재 선택된 악기:", selected);

  return (
    <select value={selected} onChange={handleChange} className={className}>
      {parts && parts.length > 0 ? (
        parts.map((part) => (
          <option key={part} value={part}>
            {part}
          </option>
        ))
      ) : (
        <option value="">파트 없음</option>
      )}
    </select>
  );
}
