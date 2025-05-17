from fastapi import FastAPI, HTTPException, APIRouter
from pathlib import Path
import services.download_wav as dlw
import services.separate_wav as spw
import services.transcribe_to_midi as tcm
from pydub import AudioSegment
from fastapi.middleware.cors import CORSMiddleware
import services.upload_to_s3 as us3

from schemas.request import YoutubeRequest
from schemas.response import CreateSheetResponse

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
        uniq_name = dlw.extract_youtube_id(req.youtube_url)
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
        results["drum"] = str(STORAGE_PATH)+ "/" + tcm.transcribe_drums_with_omnizart(path_list["drums"], str(STORAGE_PATH))
        # 베이스
        results["bass"] = tcm.bass_audio_to_midi(path_list["bass"], path_list["bass"].replace(".wav", ".mid"))
        # 기타
        # results["guitar"] = str(STORAGE_PATH)+ "/" + tcm.transcribe_music_with_omnizart(path_list["other"], str(STORAGE_PATH))
        results["guitar"] = tcm.guitar_audio_to_midi(path_list["other"], path_list["other"].replace(".wav", ".mid"))
        # 보컬
        results["vocal"] = tcm.vocal_audio_to_midi(path_list["vocals"], path_list["vocals"].replace(".wav", ".mid"))

        responseDto = {}

        for stem in results:
            print(stem)
            tcm.add_dummy_note(results[stem],results[stem],end_time)
            tcm.change_bpm(results[stem],results[stem],bpm)
            responseDto[stem] = us3.upload_file(results[stem],"original_sheets/sheet_"+uniq_name+"_"+stem+".mid")

        return CreateSheetResponse(
            title=uniq_name,
            youtube_url=req.youtube_url,
            thumbnail_url="testurl",
            bpm=bpm,
            total_measures=88, # 임시
            vocal_url=responseDto.get("vocal"),
            guitar_url=responseDto.get("guitar"),
            bass_url=responseDto.get("bass"),
            drum_url=responseDto.get("drum")
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

app.include_router(api_router)