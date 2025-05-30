import { defineNuxtPlugin } from "#app";
import VuePlyr from "@skjnldsv/vue-plyr";
import "plyr/dist/plyr.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VuePlyr, {
    plyr: {
      controls: [
        "play",
        "progress",
        "current-time",
        "mute",
        "volume",
        "settings",
        "fullscreen",
      ],
      autoplay: false,
    },
  });
});
