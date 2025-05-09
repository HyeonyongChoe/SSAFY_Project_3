import { Tooltip as ReactTooltip } from "react-tooltip";
import styles from "./Tooltip.module.css";

interface TooltipProps {
  id: string;
  variant?: "dark" | "light" | "success" | "warning" | "error" | "info";
}

export const Tooltip = ({ id, variant = "light" }: TooltipProps) => {
  return <ReactTooltip id={id} className={styles[variant]} />;
};
