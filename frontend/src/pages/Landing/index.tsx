export const LandingPage = () => {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">로그인이 필요합니다</h1>
          <p className="mb-6 text-gray-500">서비스를 이용하려면 로그인해주세요.</p>
          <a
            href="/signup"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            로그인/회원가입
          </a>
        </div>
      </div>
    );
  };
  