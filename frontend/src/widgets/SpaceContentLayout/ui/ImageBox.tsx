import { Icon } from "@/shared/ui/Icon";

interface ImageBoxProps {
  className?: String;
  onClick?: () => void;
}

export const ImageBox = ({ className, onClick }: ImageBoxProps) => {
  return (
    <div
      className={`w-[13rem] h-[13rem] bg-neutral100/30 rounded-md border-2 border-neutral100 relative p-2 ${className}`}
    >
      <div
        onClick={onClick}
        className="flex absolute right-0 bottom-0 -translate-x-2 -translate-y-2 text-neutral300 hover:text-brandcolor200 transition-all cursor-pointer"
      >
        <Icon icon="settings" fill size={32} />
      </div>
    </div>
  );
};
