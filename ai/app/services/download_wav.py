import os
import yt_dlp

def download_youtube_audio(youtube_url: str, storage_path: str) -> str:
    try:
        file_name = "input"
        wav_path = os.path.join(storage_path, file_name)
        
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': wav_path,
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'wav',
            }],
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([youtube_url])
            
        return f"{wav_path}.wav"
    
    except Exception as e:
        raise RuntimeError(f"YouTube download failed: {str(e)}")

import re

def extract_youtube_id(url):
    # 다양한 유튜브 URL 패턴을 지원하는 정규식
    regex = (
        r'(?:v=|\/)([0-9A-Za-z_-]{11})'
    )
    match = re.search(regex, url)
    if match:
        return match.group(1)
    return None