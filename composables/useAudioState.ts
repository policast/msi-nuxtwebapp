import { computed } from "vue";

interface AudioState {
  selectedThemes: string[];
}

export const useAudioState = () => {
  const state = useState<AudioState>("audio", () => ({
    selectedThemes: [] as string[],
  }));

  const audioFiles = computed(() => {
    const selected = state.value.selectedThemes;
    const files: string[] = [];

    if (selected.length === 3) {
      files.push("welcome_all.mp3");
    } else if (selected.length === 2) {
      if (
        selected.includes("Umwelt & Nachhaltigkeit") &&
        selected.includes("Schulwesen")
      ) {
        files.push("welcome_Umwelt_Schule.mp3");
      } else if (
        selected.includes("Umwelt & Nachhaltigkeit") &&
        selected.includes("Verkehr & Mobilität")
      ) {
        files.push("welcome_Umwelt_Verkehr.mp3");
      } else if (
        selected.includes("Verkehr & Mobilität") &&
        selected.includes("Schulwesen")
      ) {
        files.push("welcome_Verkehr_Schule.mp3");
      }
    } else if (selected.length === 1) {
      // Nur ein Thema ist ausgewählt
      if (selected.includes("Schulwesen")) {
        files.push("welcome_Schule.mp3");
      } else if (selected.includes("Verkehr & Mobilität")) {
        files.push("welcome_Verkehr.mp3");
      } else if (selected.includes("Umwelt & Nachhaltigkeit")) {
        files.push("welcome_Umwelt.mp3");
      }
    }

    if (selected.includes("Schulwesen")) {
      files.push("Schule.mp3");
    }
    if (selected.includes("Umwelt & Nachhaltigkeit")) {
      files.push("Umwelt.mp3");
    }
    if (selected.includes("Verkehr & Mobilität")) {
      files.push("Verkehr.mp3");
    }

    if (selected.length > 0) {
      files.push("Abschluss.mp3");
    }

    return files;
  });

  return {
    state,
    audioFiles,
  };
};
