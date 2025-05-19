import { Input } from "@/shared/ui/Input";
import { ItemField } from "@/shared/ui/ItemField";
import { useState } from "react";

export const CreateSheetForm = () => {
  const [bandName, setBandName] = useState("");

  return (
    <div className="flex flex-col gap-3">
      <ItemField
        icon="youtube_activity"
        title="Youtube Link"
        iconColor="red"
        required
      >
        <Input
          value={bandName}
          onChange={setBandName}
          placeholder="youtube 주소 (ex. https://www.youtube.com/watch?v=id)"
          maxLength={255}
          showCount={false}
        />
      </ItemField>
    </div>
  );
};
