import { useSpaceDetail } from "@/entities/band/hooks/useSpace";
import { BandForm, BandFormHandle } from "@/entities/band/ui/BandForm";
import { formatDate } from "@/shared/lib/formatDate";
import { ImageCircle } from "@/shared/ui/ImageCircle";
import { ItemField } from "@/shared/ui/ItemField";
import { forwardRef } from "react";

interface UpdateBandFormProps {
  spaceId: number;
}

export const UpdateBandForm = forwardRef<BandFormHandle, UpdateBandFormProps>(
  ({ spaceId }, ref) => {
    const { data, isLoading } = useSpaceDetail(spaceId);

    if (isLoading) {
      return <div>로딩중...</div>;
    }

    const spaceDetail = data?.data;

    return (
      <>
        <BandForm
          ref={ref}
          mode="update"
          spaceId={spaceId}
          initialData={{
            spaceName: spaceDetail?.spaceName,
            description: spaceDetail?.description,
            imageUrl: spaceDetail?.imageUrl ?? undefined,
          }}
        />
        <div className="flex flex-col gap-3 pt-3">
          <ItemField icon="group" fill title="참여 인원">
            <div className="flex flew-wrap gap-2">
              {spaceDetail?.members?.map((member) => (
                <ImageCircle
                  key={crypto.randomUUID()}
                  imageUrl={member.profileImageUrl}
                />
              ))}
            </div>
          </ItemField>
          <ItemField variant="row" icon="event" fill title="결성일">
            {formatDate(spaceDetail?.createAt)}
          </ItemField>
        </div>
      </>
    );
  }
);
