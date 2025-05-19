import { useState } from "react";
import { Button } from "../Button";
import { Input } from "../Input";

interface LineBasicProps {
  editable?: boolean;
  selected?: boolean;
  mode?: "view" | "create";
  onCreate?: (value: string) => void;
}

export const LineBasic = ({
  editable,
  selected,
  mode = "view",
  onCreate,
}: LineBasicProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [text, setText] = useState("text");
  const [originalText, setOriginalText] = useState(text);

  const handleEdit = () => {
    setOriginalText(text);
    setIsEditing(true);
    setIsConfirmingDelete(false);
  };

  const handleCancelEdit = () => {
    setText(originalText);
    setIsEditing(false);
  };

  if (mode === "create") {
    return (
      <div className="group flex gap-1.5 justify-between items-center transition-all px-2 py-3 border-b border-neutral100/30">
        <div className="flex-grow">
          <Input value={text} onChange={setText} />
        </div>
        <div className="min-w-fit">
          <Button
            icon="add"
            fill
            color="green"
            onClick={() => {
              if (onCreate) onCreate(text);
              setText("");
            }}
          >
            생성
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group flex gap-1.5 justify-between items-center transition-all px-2 py-3 border-b border-neutral100/30 ${
        isConfirmingDelete
          ? "bg-error-gradient"
          : selected
          ? "bg-success-gradient"
          : ""
      }`}
    >
      <div className="flex-grow">
        {isEditing ? (
          <Input value={text} onChange={setText} />
        ) : isConfirmingDelete ? (
          <span className="text-caution font-medium">
            정말 삭제하시겠습니까?
          </span>
        ) : (
          text
        )}
      </div>

      {editable && (
        <div className="flex gap-1 min-w-fit">
          {isEditing ? (
            <>
              <Button
                icon="check"
                fill
                color="green"
                onClick={() => setIsEditing(false)}
              >
                저장
              </Button>
              <Button icon="close" fill color="blue" onClick={handleCancelEdit}>
                취소
              </Button>
            </>
          ) : isConfirmingDelete ? (
            <>
              <Button
                icon="close"
                fill
                color="blue"
                onClick={() => setIsConfirmingDelete(false)}
              >
                취소
              </Button>
              <Button
                icon="delete"
                fill
                color="caution"
                onClick={() => {
                  console.log("삭제됨");
                }}
              >
                확인
              </Button>
            </>
          ) : (
            <>
              <Button icon="edit" fill color="dark" onClick={handleEdit}>
                수정
              </Button>
              <Button
                icon="delete"
                fill
                color="caution"
                onClick={() => setIsConfirmingDelete(true)}
              >
                삭제
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
