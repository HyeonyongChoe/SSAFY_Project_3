import { IconButton } from "@/shared/ui/Icon";
import { Popover } from "@/shared/ui/Popover";
import { NotePopover } from "./NotePopover";

export const NoteItem = () => {
  return (
    <div className="p-3 pb-2 hover:scale-[104%] transition-all duration-300 rounded-lg flex flex-col gap-2 cursor-pointer">
      {/* image */}
      <div className="w-[12rem] h-[12rem] bg-neutral100/30 rounded-lg" />
      <div className="w-full flex flex-wrap items-center justify-between px-1">
        <div className="text-lg">제목</div>
        <Popover trigger={<IconButton icon="more_horiz" />}>
          <NotePopover />
        </Popover>
      </div>
    </div>
  );
};
