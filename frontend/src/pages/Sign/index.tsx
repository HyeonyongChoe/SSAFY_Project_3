<<<<<<< HEAD
import { useNavigate } from "react-router-dom";

export const SignPage = () => {
  const navigate = useNavigate();
=======
import Buttonkakao from "@/features/auth/kakao/ui/ButtonKakao";

export const SignPage = () => {
  const REDIRECT_URI =
    import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_KAKAO_REDIRECT_URI;

  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${
    import.meta.env.VITE_KAKAO_CLIENT_ID
  }&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const handleLoginClick = () => {
    window.location.href = KAKAO_AUTH_URL;
  };
>>>>>>> fc207f268e5d90bbb99f2d88b7dbae08a5f6ce66

  return (
    <div className="w-fit max-w-full h-full flex flex-col justify-center items-center gap-12">
      <div className="font-cafe24 text-brandcolor200 text-2xl">
        박자로 이어지는 우리 사이
      </div>
<<<<<<< HEAD
      <div className="bg-kakao-container">
        카카오로 3초만에 시작하기(임시 버튼)
      </div>
      <div
        className="bg-kakao-container cursor-pointer"
        onClick={() => navigate("/room")}
      >
        악보를 등록 하시오
      </div>
=======
      <Buttonkakao onClick={handleLoginClick} />
>>>>>>> fc207f268e5d90bbb99f2d88b7dbae08a5f6ce66
    </div>
  );
};
