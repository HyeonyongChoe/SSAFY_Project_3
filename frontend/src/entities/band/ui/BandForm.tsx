import { ImageUploadCircle } from "@/shared/ui/ImageCircle";
import { Input } from "@/shared/ui/Input";
import { ItemField } from "@/shared/ui/ItemField";
import { TextArea } from "@/shared/ui/Textarea";
import { forwardRef, useImperativeHandle, useState } from "react";

export interface BandFormHandle {
  getFormData: () => FormData;
}

export const BandForm = forwardRef<BandFormHandle>((_, ref) => {
  const [bandName, setBandName] = useState("");
  const [bandDetail, setBandDetail] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useImperativeHandle(ref, () => ({
    getFormData() {
      const formData = new FormData();
      formData.append("bandName", bandName);
      formData.append("bandDetail", bandDetail);
      if (imageFile) formData.append("bandImage", imageFile);
      return formData;
    },
  }));

  return (
    <div className="flex flex-col gap-3">
      <div className="self-center mb-2">
        <ImageUploadCircle onChange={setImageFile} />
      </div>
      <ItemField icon="diversity_3" title="밴드 이름" required>
        <Input
          value={bandName}
          onChange={setBandName}
          placeholder="밴드 이름 (ex. 비트윈)"
          maxLength={20}
          showCount={true}
        />
      </ItemField>
      <ItemField icon="subject" title="밴드 설명" required>
        <TextArea
          value={bandDetail}
          onChange={setBandDetail}
          placeholder="밴드 설명 (ex. 음악에 진지한 직장인 밴드)"
        />
      </ItemField>
    </div>
  );
});
