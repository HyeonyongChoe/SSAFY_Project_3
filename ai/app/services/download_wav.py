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
