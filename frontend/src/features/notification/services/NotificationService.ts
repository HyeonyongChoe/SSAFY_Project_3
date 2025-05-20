export const subscribeSheetStatus = (spaceId: number): EventSource => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  // 아직 로그인이 구현되지 않아서 하드하게 처리, 로그인이 구현되면 수정해야 합니다
  const url = `${baseUrl}/api/v1/spaces/${spaceId}/songs/sheets/subscribe?X-USER-ID=1`;
  return new EventSource(url, { withCredentials: true });
};
