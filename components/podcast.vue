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
    { title: 'Folge 1', src: '/audio/episode_13857.mp3' },
    { title: 'Folge 2', src: '/audio/episode_14084.mp3' },
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

        <ul class="playlist">
            <li v-for="(track, idx) in playlist" :key="idx" @click="playTrack(idx)"
                :class="{ active: idx === currentIndex }">
                {{ track.title }}
            </li>
        </ul>

    </div>

</template>

<style lang="scss" scoped>
.podcast-wrapper {
    @include mix.center($g: 8px);
    background-color: #D9D9D9;
    flex-wrap: wrap;
    width: 90vw;
    padding: 24px 16px;
    border-radius: 20px;
}

.playlist {
    list-style: none;
    padding: 0;
}

.playlist li {
    cursor: pointer;
    padding: 0.5em;
}

.playlist li.active {
    font-weight: bold;
}

.plyr__controls {
    border-radius: 15px;
}
</style>