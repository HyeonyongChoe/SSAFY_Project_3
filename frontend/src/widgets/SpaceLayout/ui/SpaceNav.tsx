import { SpaceNavItem } from "./SpaceNavItem";
import { useLocation, useNavigate } from "react-router-dom";
import { ImageCircle } from "@/shared/ui/ImageCircle/ImageCircle";
import { CreateBandButton } from "@/features/createBand";
import { Popover } from "@/shared/ui/Popover";
import { UserSettingModal } from "@/features/user/UserSettingModal";

// 임시 Interface 및 데이터입니다
// 차후 API 연결시 Band.ts 파일을 따로 빼서 끌어오도록 하며, 변수 명도 API에 맞게 변경하도록 합니다
interface BandSummary {
  id: number;
  name: string;
  imageUrl: string;
}

const dummyBands: BandSummary[] = [
  {
    id: 1,
    name: "밴드 1",
    imageUrl:
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 2,
    name: "밴드 2",
    imageUrl:
      "https://images.pexels.com/photos/351265/pexels-photo-351265.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 3,
    name: "밴드 3",
    imageUrl:
      "https://images.pexels.com/photos/952437/pexels-photo-952437.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 4,
    name: "밴드 4 가로 길이를 제한하여 이름이 길 경우 줄바꿈이 일어나도록 tooptip을 구성함",
    imageUrl: "incorrect url",
  },
  {
    id: 5,
    name: "이미지가 없는 밴드도 있다",
    imageUrl: "",
  },
];

const dummyPerson = {
  id: 1,
  imageUrl:
    "https://images.pexels.com/photos/3866555/pexels-photo-3866555.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
};

export const SpaceNav = () => {
  const location = useLocation();
  const isRoot = location.pathname === "/";
  const navigate = useNavigate();

  return (
    <aside className="h-full bg-neutral100/10 shadow-custom rounded-xl flex flex-col justify-between px-1 py-3">
      <nav className="flex flex-col items-center overflow-y-auto scroll-custom overflow-x-hidden gap-3">
        {/* My Band */}
        <SpaceNavItem
          isMe={true}
          name="나의 밴드"
          isActive={isRoot}
          onClick={() => {
            navigate("/");
          }}
        />
        {/* divider */}
        <div className="px-2 w-full">
          <div className="divider px-2" />
        </div>
        {/* Team Band */}
        {dummyBands.map((band) => {
          const teamActive = location.pathname === `/team/${band.id}`;

          return (
            <SpaceNavItem
              key={band.id}
              bandId={band.id}
              imageUrl={band.imageUrl}
              name={band.name}
              onClick={() => {
                navigate(`/team/${band.id}`);
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
