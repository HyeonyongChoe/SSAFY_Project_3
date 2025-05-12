import { useModalStore } from "@/shared/lib/store/modalStore";
import { ModalBackground } from "./ModalBackground";
import { PanelModal } from "../Panel";
import { IconButton } from "../Icon";
import { Button } from "../Button";

export const ModalAction = () => {
  const { props, closeModal } = useModalStore();
  const { title, info, children, okText, onConfirm } = props;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    closeModal();
  };

  return (
    <ModalBackground>
      <PanelModal
        tone="light"
        className="w-[24rem] max-w-full max-h-[calc(100vh-3rem)] m-6 flex flex-col items-center gap-5 py-10 pt-2 pb-6 px-6"
      >
        <p className="w-full flex justify-end">
          <IconButton icon="close" onClick={closeModal} />
        </p>
        <div className="flex flex-col gap-4 items-center text-center">
          <p className="text-2xl font-bold">{title}</p>
          <p className="whitespace-pre-line">{info}</p>
        </div>
        {/* content */}
        <div className="w-full overflow-y-auto scroll-custom">{children}</div>
        {/* bottom button */}
        <div className="flex flex-wrap gap-2">
          <Button size="medium" color="blue" onClick={handleConfirm}>
            {okText ? okText : "닫기"}
          </Button>
        </div>
      </PanelModal>
    </ModalBackground>
  );
};
