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
        className="overflow-visible w-[24rem] max-w-full max-h-[calc(100vh-3rem)] m-6 flex flex-col items-center gap-5 px-4 pt-3 pb-6"
      >
        <p className="w-full flex justify-end pl-2">
          <IconButton icon="close" onClick={closeModal} />
        </p>
        <div className="flex flex-col gap-4 items-center text-center px-2">
          <p className="text-2xl font-bold">{title}</p>
          <p className="whitespace-pre-line">{info}</p>
        </div>
        {/* content */}
        <div className="w-full border-box overflow-y-auto overflow-x-visible scroll-custom px-2">
          {children}
        </div>
        {/* bottom button */}
        <div className="flex flex-wrap gap-2 px-2">
          {okText != null && (
            <Button size="medium" color="blue" onClick={handleConfirm}>
              {okText}
            </Button>
          )}
        </div>
      </PanelModal>
    </ModalBackground>
  );
};
