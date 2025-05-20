import Buttonkakao from "@/features/auth/kakao/ui/ButtonKakao";

export const SignPage = () => {
  console.log("여기에서 환경변수를 로그로 출력");
  console.log(import.meta.env); // 로그로 환경변수 잘 들어갔는지 확인
  const REDIRECT_URI =
    import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_KAKAO_REDIRECT_URI;

  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${
    import.meta.env.VITE_KAKAO_CLIENT_ID
  }&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const handleLoginClick = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <div className="w-fit max-w-full h-full flex flex-col justify-center items-center gap-12">
      <div className="font-cafe24 text-brandcolor200 text-2xl">
        박자로 이어지는 우리 사이
      </div>
      <Buttonkakao onClick={handleLoginClick} />
    </div>
  );
};
