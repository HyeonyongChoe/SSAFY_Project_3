import { Tone } from "@/shared/types/tone";

export interface IconProps {
  icon: string;
  fill?: boolean;
  size?: number;
  tone?: Tone;
  className?: string; // ✅ 추가

}
