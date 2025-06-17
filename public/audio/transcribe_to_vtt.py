#!/usr/bin/env python3

# Requirements
# **FFmpeg**  and **openai-whisper**

# How to use :
# env\Scripts\activate
# cd public/audio
# python transcribe_to_vtt.py

import glob
import os
from typing import List, Dict, Any
import whisper


def fmt_timestamp(t: float) -> str:
    """Formatiert Sekunden in WebVTT-Zeitstempel."""
    h = int(t // 3600)
    m = int((t % 3600) // 60)
    s = t % 60
    return f"{h:02}:{m:02}:{s:06.3f}"


def transcribe_to_vtt(audio_path: str, model: whisper.Whisper) -> None:
    """
    Transkribiert die gegebene Audiodatei und erstellt eine .vtt-Datei
    mit Zeitmarkierungen für den jeweiligen Textabschnitt.
    """
    vtt_path = os.path.splitext(audio_path)[0] + ".vtt"
    if os.path.exists(vtt_path):
        print(f"⏩ Überspringe {audio_path} – .vtt bereits vorhanden.")
        return

    print(f"🔊 Transkribiere: {audio_path}")

    try:
        result = model.transcribe(
            audio_path, language="de", task="transcribe", verbose=False
        )
    except Exception as e:
        print(f"❌ Fehler bei der Transkription von {audio_path}: {e}")
        return

    segments_raw = result.get("segments", [])
    if not isinstance(segments_raw, list):
        print("⚠️  Keine gültigen Segmente gefunden.")
        return

    segments: List[Dict[str, Any]] = segments_raw

    vtt_path = os.path.splitext(audio_path)[0] + ".vtt"
    with open(vtt_path, "w", encoding="utf-8") as f:
        f.write("WEBVTT\n\n")
        for i, seg in enumerate(segments, start=1):
            start = fmt_timestamp(seg["start"])
            end = fmt_timestamp(seg["end"])
            text = seg["text"].strip()

            f.write(f"{i}\n")
            f.write(f"{start} --> {end}\n")
            f.write(f"{text}\n\n")

    print(f"✅ Fertig: {vtt_path}")


def main() -> None:
    print("🚀 Lade Whisper-Modell...")
    model = whisper.load_model("small")  # Alternativen: "medium", "large"

    audio_files = glob.glob("episode*.mp3")
    if not audio_files:
        print("❌ Keine MP3-Dateien im Format 'episode*.mp3' gefunden.")
        return

    print(f"🎧 Gefundene Dateien: {len(audio_files)}")
    for idx, audio_file in enumerate(audio_files, start=1):
        print(f"\n[{idx}/{len(audio_files)}]")
        transcribe_to_vtt(audio_file, model)


if __name__ == "__main__":
    main()
