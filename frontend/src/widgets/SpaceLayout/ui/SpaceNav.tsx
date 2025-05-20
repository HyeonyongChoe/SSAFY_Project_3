import { SpaceNavItem } from "./SpaceNavItem";
import { useLocation, useNavigate } from "react-router-dom";
import { ImageCircle } from "@/shared/ui/ImageCircle/ImageCircle";
import { CreateBandButton } from "@/features/createBand";
import { Popover } from "@/shared/ui/Popover";
import { UserSettingModal } from "@/features/user/UserSettingModal";
import { useSpace } from "@/entities/band/hooks/useSpace";
import { usePersonalSpaceStore } from "@/entities/band/model/store";
import { useEffect } from "react";

// 임시 데이터입니다
const dummyPerson = {
  id: 1,
  imageUrl:
    "https://images.pexels.com/photos/3866555/pexels-photo-3866555.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
};

export const SpaceNav = () => {
  const location = useLocation();
  const isRoot = location.pathname === "/";
  const navigate = useNavigate();

  const { data } = useSpace();
  const bands = data?.data || [];

  const myBand = bands.find((band) => band.space_type === "PERSONAL");

  const setPersonalSpaceId = usePersonalSpaceStore(
    (state) => state.setPersonalSpaceId
  );

  useEffect(() => {
    if (myBand) {
      setPersonalSpaceId(myBand.space_id);
    }
  }, [myBand, setPersonalSpaceId]);

  const teamBands = bands.filter((band) => band.space_type === "TEAM");

  return (
    <aside className="h-full bg-neutral100/10 shadow-custom rounded-xl flex flex-col justify-between px-1 py-3">
      <nav className="flex flex-col items-center overflow-y-auto scroll-custom overflow-x-hidden gap-3">
        {/* My Band */}
        {myBand && (
          <SpaceNavItem
            isMe={true}
            bandId={myBand.space_id}
            name="나의 밴드"
            isActive={isRoot}
            onClick={() => {
              navigate("/");
            }}
          />
        )}
        {/* divider */}
        <div className="px-2 w-full">
          <div className="divider px-2" />
        </div>
        {/* Team Band */}
        {teamBands.map((band) => {
          const teamActive = location.pathname === `/team/${band.space_id}`;
          return (
            <SpaceNavItem
              key={band.space_id}
              bandId={band.space_id}
              imageUrl={band.img_url}
              name={band.space_name}
              onClick={() => {
                navigate(`/team/${band.space_id}`);
              }}
              isActive={teamActive}
            />
          );
        })}

        {/* Add Team Band Button */}
        <div className="p-1">
          <CreateBandButton />
        </div>
      </nav>
      {/* account circle */}
      <div className="flex flex-col justify-center items-center gap-3 pt-3">
        {/* divider */}
        <div className="px-2 w-full">
          <div className="divider px-2" />
        </div>
        <div className="cursor-pointer">
          <Popover trigger={<ImageCircle imageUrl={dummyPerson.imageUrl} />}>
            <UserSettingModal />
          </Popover>
        </div>
      </div>
    </aside>
  );
};
