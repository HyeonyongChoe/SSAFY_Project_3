from fastapi import FastAPI, HTTPException, APIRouter
from pathlib import Path
import services.download_wav as dlw
import services.separate_wav as spw
import services.transcribe_to_midi as tcm
from pydub import AudioSegment
from fastapi.middleware.cors import CORSMiddleware

from schemas.request import YoutubeRequest

api_router = APIRouter(prefix="/ai")

BASE_DIR = Path(__file__).parent.resolve()
STORAGE_PATH = BASE_DIR / ".." / "storage"
STORAGE_PATH.mkdir(parents=True, exist_ok=True)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["k12a205.p.ssafy.io:8080","localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@api_router.post("/transcription")
async def process_youtube(req: YoutubeRequest):
    try:
        # 1. 유튜브 오디오 다운로드
        wav_path = dlw.download_youtube_audio(req.youtube_url, str(STORAGE_PATH))
        
        # bpm 추출
        bpm = int(tcm.extract_bpm(wav_path))
        
        # 끝나는 시간 추출

        # 2. 악기 분리
        path_list = spw.separate_audio_with_demucs(wav_path, str(STORAGE_PATH))

        for stem in path_list:
            click = AudioSegment.from_wav(wav_path.replace("input", "click"))
            track = AudioSegment.from_wav(path_list[stem])
            new_track = click + track + click  # 앞뒤 클릭 삽입
            new_track.export(path_list[stem], format="wav")

        end_time = tcm.get_wav_duration(path_list["other"])
        
        # 3. 전사 요청
        results = {}
        # 드럼
        results["drums"] = str(STORAGE_PATH)+ "/" + tcm.transcribe_drums_with_omnizart(path_list["drums"], str(STORAGE_PATH))
        # 베이스
        results["bass"] = tcm.bass_audio_to_midi(path_list["bass"], path_list["bass"].replace(".wav", ".mid"))
        # 기타
        # results["guitar"] = str(STORAGE_PATH)+ "/" + tcm.transcribe_music_with_omnizart(path_list["other"], str(STORAGE_PATH))
        results["guitar"] = tcm.guitar_audio_to_midi(path_list["other"], path_list["other"].replace(".wav", ".mid"))
        # 보컬
        results["vocals"] = tcm.vocal_audio_to_midi(path_list["vocals"], path_list["vocals"].replace(".wav", ".mid"))

        for stem in results:
            print(stem)
            tcm.add_dummy_note(results[stem],results[stem],end_time)
            tcm.change_bpm(results[stem],results[stem],bpm)

        return {
            "message": "변환 완료",
            "bpm": bpm,
            "results": results
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

app.include_router(api_router)