"""
OpenSolat - Audio Optimization Utility
Compresses vocal tracks (Azan, Takbir, Doa) to high-efficiency 64kbps mono MP3
to keep the mobile app lightweight while preserving vocal clarity.
"""

import os
import glob
import subprocess

try:
    import imageio_ffmpeg
    FFMPEG_BIN = imageio_ffmpeg.get_ffmpeg_exe()
except ImportError:
    FFMPEG_BIN = "ffmpeg"

AUDIO_DIR = os.path.join(os.path.dirname(__file__), "..", "assets", "audio")

def optimize_audio():
    files = sorted(glob.glob(os.path.join(AUDIO_DIR, "*.mp3")))
    print(f"Found {len(files)} audio files in {AUDIO_DIR}")
    
    total_before = 0
    total_after = 0
    
    for f in files:
        sz_before = os.path.getsize(f)
        total_before += sz_before
        
        # Don't re-compress short beeps (< 100 KB)
        if sz_before < 100 * 1024:
            print(f"Skipping {os.path.basename(f)} ({sz_before / 1024:.1f} KB - already tiny)")
            total_after += sz_before
            continue
            
        temp_out = f + ".temp.mp3"
        cmd = [
            FFMPEG_BIN,
            "-y",
            "-i", f,
            "-ac", "1",         # Mono channel for clear human voice projection
            "-b:a", "64k",      # 64kbps CBR
            "-ar", "44100",     # 44.1kHz studio sample rate
            temp_out
        ]
        
        try:
            subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
            sz_after = os.path.getsize(temp_out)
            total_after += sz_after
            os.replace(temp_out, f)
            print(f"Optimized {os.path.basename(f)}: {sz_before / (1024*1024):.2f} MB -> {sz_after / (1024*1024):.2f} MB (-{((sz_before - sz_after)/sz_before)*100:.1f}%)")
        except Exception as e:
            if os.path.exists(temp_out):
                os.remove(temp_out)
            print(f"Error compressing {f}: {e}")
            total_after += sz_before

    print("-" * 50)
    print(f"Total Size Before: {total_before / (1024*1024):.2f} MB")
    print(f"Total Size After:  {total_after / (1024*1024):.2f} MB")
    print(f"Saved:             {(total_before - total_after) / (1024*1024):.2f} MB (-{((total_before - total_after)/total_before)*100:.1f}%)")

if __name__ == "__main__":
    optimize_audio()
