import { BandForm } from "@/entities/band/ui/BandForm";
import { ImageCircle } from "@/shared/ui/ImageCircle";
import { ItemField } from "@/shared/ui/ItemField";

export const UpdateBandForm = () => {
  return (
    <>
      <BandForm />
      <div className="flex flex-col gap-3 pt-3">
        <ItemField icon="group" fill title="참여 인원">
          <div className="flex flew-wrap gap-2">
            <ImageCircle />
            <ImageCircle />
            <ImageCircle />
            <ImageCircle />
            <ImageCircle />
          </div>
        </ItemField>
        <ItemField variant="row" icon="event" fill title="결성일">
          2025.05.19
        </ItemField>
      </div>
    </>
  );
};
