import { Button } from "@/shared/ui/Button";
import { ImageBox } from "./ui/ImageBox";
import { PlaywithButton } from "./ui/PlaywithButton";
import { ImageCircle } from "@/shared/ui/ImageCircle";
import { NoteItem } from "./ui/NoteItem";
import { CreateSheetButton } from "./ui/CreateSheetButton";
import { useNavigate } from "react-router-dom";
import { openConfirm, openModal } from "@/shared/lib/modal";
import { toast } from "@/shared/lib/toast";
import { ManageCategoryForm } from "@/features/manageCategory/ui/ManageCategoryForm";
import { UpdateBandForm } from "@/features/updateBand/ui/UpdateBandForm";

interface SpaceContentLayoutProps {
  type?: "personal" | "team";
  teamId?: number;
  subtitle?: String;
  title?: String;
  summary?: String;
  teamImageUrl?: String;
}

export const SpaceContentLayout = ({
  type = "team",
  teamId,
  subtitle,
  title,
  summary,
  teamImageUrl,
}: SpaceContentLayoutProps) => {
  const isOwner = true;
  const navigate = useNavigate();

  return (
    // background
    <div>
      {/* content-header */}
      <div
        className="flex flex-wrap gap-6 w-full bg-cover bg-center px-6 py-7 min-w-fit"
        style={{
          backgroundImage: `
      linear-gradient(to top, rgba(27, 32, 53, 1), rgba(27, 32, 53, 0)),
      url(${teamImageUrl})
    `,
        }}
      >
        <ImageBox
          className={"shrink-0"}
          onClick={() =>
            openModal({
              title: "밴드 수정하기",
              children: <UpdateBandForm />,
              okText: "수정하기",
              onConfirm: () =>
                toast.warning({
                  title: "API 없음",
                  message: "아직 API가 연결되지 않았습니다. 연결해주세요.",
                }),
            })
          }
        />
        <div className="py-2 flex flex-col gap-3 flex-grow text-left max-w-[70rem] self-center">
          <div>
            {subtitle && (
              <div className="text-neutral100/70 text-sm">{subtitle}</div>
            )}
            {title && <div className="text-2xl font-bold">{title}</div>}
          </div>
          {summary && <div>{summary}</div>}
          {type === "team" && (
            <div className="flex flew-wrap gap-2">
              <ImageCircle />
              <ImageCircle />
              <ImageCircle />
              <ImageCircle />
              <ImageCircle />
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {type === "team" && (
              <>
                <Button
                  icon="link"
                  color="green"
                  onClick={() => {
                    navigator.clipboard
                      .writeText("abc")
                      .then(() => {
                        toast.success({
                          title: "복사 성공",
                          message: "초대 링크가 클립보드로 복사되었습니다.",
                        });
                      })
                      .catch(() => {
                        toast.error({
                          title: "복사 실패",
                          message:
                            "초대 링크를 받아오는 데 실패했습니다. 다시 시도해주세요.",
                        });
                      });
                  }}
                >
                  초대 링크 복사
                </Button>
                {isOwner ? (
                  <Button
                    icon="delete"
                    fill
                    color="caution"
                    onClick={() =>
                      openConfirm({
                        title: "정말 밴드를 삭제하시겠습니까?",
                        info: "한 번 지운 밴드는 다시 되돌릴 수 없습니다",
                        cancelText: "아니오",
                        okText: "나가기",
                        onConfirm: () => console.log("탈퇴 구현 예정"),
                        onCancel: () => console.log("취소됨"),
                      })
                    }
                  >
                    밴드 삭제하기
                  </Button>
                ) : (
                  <Button
                    icon="logout"
                    color="caution"
                    onClick={() =>
                      openConfirm({
                        title: "정말 밴드를 나가시겠습니까?",
                        info: "다시 밴드에 들어가기 위해서는 밴드 관리자의 초대가 필요합니다",
                        cancelText: "아니오",
                        okText: "나가기",
                        onConfirm: () => console.log("탈퇴 구현 예정"),
                        onCancel: () => console.log("취소됨"),
                      })
                    }
                  >
                    밴드 나가기
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {/* button section */}
      <div className="w-full flex flex-wrap gap-3 px-6">
        <CreateSheetButton />
        {type === "team" && (
          <PlaywithButton
            onClick={() => {
              navigate(`/room/${teamId}`);
            }}
          />
        )}
      </div>
      {/* note list */}
      <div className="px-6 py-10 flex flex-col gap-4">
        {/* list title */}
        <div className="flex flex-wrap justify-between">
          <div className="text-2xl font-bold">악보 목록</div>
          <Button
            icon="settings"
            fill
            size="small"
            onClick={() =>
              openModal({
                title: "카테고리 관리하기",
                children: <ManageCategoryForm />,
                okText: "만들기",
                onConfirm: () =>
                  toast.warning({
                    title: "API 없음",
                    message: "아직 API가 연결되지 않았습니다. 연결해주세요.",
                  }),
                buttonType: "icon",
                icon: "add_circle",
                fill: true,
              })
            }
          >
            카테고리 관리하기
          </Button>
        </div>
        {/* category title */}
        <div className="text-left text-xl font-bold">카테고리 1</div>
        <div className="flex flex-wrap">
          <NoteItem />
          <NoteItem />
        </div>
      </div>
    </div>
  );
};
