<script setup lang="ts">
import { ref } from 'vue'
import type { VuePlyr } from '@skjnldsv/vue-plyr'

const plyrOptions = {
    controls: [
        'play',
        'progress',
        'current-time',
        'mute',
        'volume',
        'settings'
    ],
    autoplay: false,
}

interface Track {
    src: string
    vtt: string
    title: string
    date: string
}

const playlist = ref<Track[]>([
    { src: '/audio/episode_13857.mp3', date: '28.04.2025', title: 'Kinder, Jugendliche und Familien', vtt: '/audio/episode_13857.vtt' },
    { src: '/audio/episode_14084.mp3', date: '27.04.2025', title: 'Kommission zur Förderung der Inklusion von Menschen mit Behinderung', vtt: '/audio/episode_14084.vtt' },
])

const currentIndex = ref(0)
const currentTrack = ref<Track>(playlist.value[0])
const plyrComponent = ref<InstanceType<typeof VuePlyr> | null>(null)
const cues = ref<VTTCue[]>([])
const activeCue = ref<VTTCue | null>(null)
const showFull = ref(false)
let plyrInstance: any = null

function onReady(readyEvent: any) {
    plyrInstance = readyEvent.detail.plyr

    loadTrack(currentIndex.value)
}

function playTrack(idx: number) {
    if (!plyrInstance) return
    currentIndex.value = idx
    loadTrack(currentIndex.value)
    // plyrInstance.play()
}

function loadTrack(idx: number) {
    currentIndex.value = idx
    currentTrack.value = playlist.value[idx]
    if (!plyrInstance) return
    plyrInstance.source = {
        type: 'audio',
        sources: [{ src: currentTrack.value.src, type: 'audio/mp3' }],
        tracks: [
            {
                kind: 'captions',
                src: currentTrack.value.vtt,
                srclang: 'de',
                label: 'Transkript',
                default: true,
            },
        ],
    }

  plyrInstance.media.addEventListener('loadedmetadata', () => {
    const media = plyrComponent.value?.plyr.media as HTMLMediaElement
    const track = media.textTracks[0]
    track.mode = 'hidden'

    if (track.cues) {
      cues.value = Array.from(track.cues).map((c: TextTrackCue) => c as VTTCue)
    }
    activeCue.value = null
  }, { once: true })
}

function onTimeUpdate(event: any) {
  const currentTime = (event.detail.plyr as any).currentTime as number
  activeCue.value = cues.value.find((c: VTTCue) => c.startTime <= currentTime && c.endTime >= currentTime) || null
}

</script>

<template>

    <div class="podcast-wrapper">

        <vue-plyr ref="plyrComponent" :options="plyrOptions" @ready="onReady" @timeupdate="onTimeUpdate">
            <audio crossorigin="anonymous">
                <source :src="currentTrack.src" type="audio/mp3" />
                <track kind="captions" :src="currentTrack.vtt" srclang="de" label="Transkript" default />
            </audio>
        </vue-plyr>

        <div class="vtt-content">
            <div class="transcript-controls">
                <label>
                    <input type="checkbox" v-model="showFull" /> Show full transcript
                </label>
            </div>

            <!-- Transcript Display -->
            <div class="transcript">
                <template v-if="showFull">
                    <p v-for="(cue, i) in cues" :key="i">{{ cue.text }}</p>
                </template>
                <template v-else>
                    <p v-if="activeCue" class="active-cue">{{ activeCue.text }}</p>
                    <p v-else class="no-cue">No active caption</p>
                </template>
            </div>
        </div>

        <ul class="playlist">
            <li class="chapter" v-for="(track, idx) in playlist" :key="idx" @click="playTrack(idx)"
                :class="{ active: idx === currentIndex }">
                <span>{{ track.date }}</span>
                <span>{{ track.title }}</span>
            </li>
        </ul>

    </div>

</template>

<!-- TODO: li elemente so anpassen , mit Detail anzeigen der Folgen , evtl "Aktiv setzten" mit erweiterten Details , andere verkleinert mit Title  / Datum nur -->

<style lang="scss" scoped>
.podcast-wrapper {
    @include mix.center($g: 8px);
    flex-direction: column;
    background-color: #D9D9D9;
    flex-wrap: wrap;
    width: 90vw;
    padding: 24px 16px;
    border-radius: 20px;
}

.playlist {
    @include mix.center($g: 8px);
    flex-direction: column;
    width: 100%;
}

.chapter {
    @include mix.center($jc: space-between, $g: 8px);
    flex-direction: row;
    cursor: pointer;
    padding: 0.5em 1.5em;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 50%;
    background-color: white;
}

.active {
    font-weight: bold;
}

:deep(.plyr) {
    max-width: 800px;
    margin: 2rem auto;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.transcript-controls {
  margin: 1rem 0;
}
.transcript {
  max-height: 300px;
  overflow-y: auto;
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 0.25rem;
}
.active-cue {
  font-weight: bold;
  color: #007acc;
}
.no-cue {
  color: #666;
}
</style>