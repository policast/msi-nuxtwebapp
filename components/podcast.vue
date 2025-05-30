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

const playlist = [
    { src: '/audio/episode_13857.mp3', date: '28.04.2025', title: 'Kinder, Jugendliche und Familien' },
    { src: '/audio/episode_14084.mp3', date: '27.04.2025', title: 'Kommission zur Förderung der Inklusion von Menschen mit Behinderung' },
]

const currentIndex = ref(0)
const plyrComponent = ref<InstanceType<typeof VuePlyr> | null>(null)
let plyrInstance: any = null

function onReady(readyEvent: any) {

    plyrInstance = readyEvent.detail.plyr

    plyrInstance.source = {
        type: 'audio',
        sources: [{ src: playlist[0].src, type: 'audio/mp3' }]
    }
}

function playTrack(idx: number) {
    if (!plyrInstance) return
    currentIndex.value = idx
    plyrInstance.source = {
        type: 'audio',
        sources: [{ src: playlist[idx].src, type: 'audio/mp3' }]
    }
    plyrInstance.play()
}

</script>

<template>

    <div class="podcast-wrapper">

        <vue-plyr ref="plyrComponent" :options="plyrOptions" @ready="onReady">
            <audio />
        </vue-plyr>

        <div class="playlist">
            <div class="chapter" v-for="(track, idx) in playlist" :key="idx" @click="playTrack(idx)"
                :class="{ active: idx === currentIndex }">
                <span>{{ track.date }}</span>
                <span>{{ track.title }}</span>
            </div>
        </div>

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

</style>