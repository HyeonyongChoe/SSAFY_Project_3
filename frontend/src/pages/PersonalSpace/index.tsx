import { usePersonalSpaceStore } from "@/entities/band/model/store";
import { SpaceContentLayout } from "@/widgets/SpaceContentLayout";

export const PersonalSpacePage = () => {
  const personalSpaceId = usePersonalSpaceStore(
    (state) => state.personalSpaceId
  );

  return (
    <SpaceContentLayout
      teamId={Number(personalSpaceId)}
      type="personal"
      teamImageUrl={
        "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      }
      subtitle={"가입일 2025.04.29"}
      title={"MY MUSIC"}
      summary={"키보드 조작으로 단련된 손가락이 신들린 연주를 한다.."}
    />
  );
};
