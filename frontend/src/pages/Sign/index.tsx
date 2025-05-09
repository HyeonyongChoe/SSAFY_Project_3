import { useNavigate } from "react-router-dom";

export const SignPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-12">
      <div className="font-cafe24 text-brandcolor200 text-2xl">
        박자로 이어지는 우리 사이
      </div>
      <div className="bg-kakao-container">
        카카오로 3초만에 시작하기(임시 버튼)
      </div>
      <div
        className="bg-kakao-container cursor-pointer"
        onClick={() => navigate("/room")}
      >
        악보를 등록 하시오
      </div>
    </div>
  );
};
