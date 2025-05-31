interface VTTCue {
  startTime: number;
  endTime: number;
  text: string;
}

export function useVTTParser() {
  const parseVTT = (vttContent: string): VTTCue[] => {
    const lines: string[] = vttContent.split("\n");
    const cues: VTTCue[] = [];
    let currentCue: Partial<VTTCue> | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line === "WEBVTT" || (line === "" && !currentCue)) continue;

      if (line.includes("-->")) {

        if (
          currentCue &&
          currentCue.startTime !== undefined &&
          currentCue.endTime !== undefined &&
          currentCue.text !== undefined
        ) {
          cues.push(currentCue as VTTCue);
        }

        const [startTime, endTime] = line
          .split("-->")
          .map((t: string) => t.trim());

        currentCue = {
          startTime: parseTimestamp(startTime),
          endTime: parseTimestamp(endTime),
          text: "",
        };
      }

      else if (currentCue && line !== "") {
        currentCue.text = currentCue.text
          ? currentCue.text + "\n" + line
          : line;
      }

      else if (currentCue && line === "") {
        if (
          currentCue.startTime !== undefined &&
          currentCue.endTime !== undefined &&
          currentCue.text !== undefined
        ) {
          cues.push(currentCue as VTTCue);
        }
        currentCue = null;
      }
    }

    if (
      currentCue &&
      currentCue.startTime !== undefined &&
      currentCue.endTime !== undefined &&
      currentCue.text !== undefined
    ) {
      cues.push(currentCue as VTTCue);
    }

    return cues;
  };

  const parseTimestamp = (timestamp: string): number => {
    // Remove any additional formatting (like position tags)
    const cleanTimestamp = timestamp.split(" ")[0];
    const parts: string[] = cleanTimestamp.split(":");

    const seconds: number = parseFloat(parts[parts.length - 1]);
    const minutes: number = parseInt(parts[parts.length - 2]) || 0;
    const hours: number = parseInt(parts[parts.length - 3]) || 0;

    return hours * 3600 + minutes * 60 + seconds;
  };

  const getCurrentCue = (
    cues: VTTCue[],
    currentTime: number
  ): VTTCue | undefined => {
    return cues.find(
      (cue: VTTCue) =>
        currentTime >= cue.startTime && currentTime <= cue.endTime
    );
  };

  const getAllText = (cues: VTTCue[]): string => {
    return cues.map((cue: VTTCue) => cue.text).join("\n\n");
  };

  // Debug-Funktion um zu sehen was geparst wurde
  const debugCues = (cues: VTTCue[]): void => {
    console.log(`Parsed ${cues.length} cues:`);
    cues.forEach((cue, index) => {
      console.log(
        `Cue ${index + 1}: ${cue.startTime}s - ${cue.endTime}s: "${cue.text}"`
      );
    });
  };

  return {
    parseVTT,
    getCurrentCue,
    getAllText,
  };
}
