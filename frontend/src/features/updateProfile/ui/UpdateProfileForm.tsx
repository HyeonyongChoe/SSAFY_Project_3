import { ImageUploadCircle } from "@/shared/ui/ImageCircle";
import { Input } from "@/shared/ui/Input";
import { ItemField } from "@/shared/ui/ItemField";
import { useState } from "react";

export const UpdateProfileForm = () => {
  const [nickname, setNickname] = useState("");

  return (
    <div className="flex flex-col gap-3">
      <div className="self-center mb-2">
        <ImageUploadCircle />
      </div>
      <ItemField icon="person" fill title="닉네임" required>
        <Input
          value={nickname}
          onChange={setNickname}
          placeholder="닉네임"
          maxLength={20}
          showCount={true}
        />
      </ItemField>
      <ItemField variant="row" icon="alternate_email" title="이메일">
        email@email.com
      </ItemField>
    </div>
  );
};
