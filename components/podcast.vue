<script setup lang="ts">
import { ref, computed } from 'vue'
import Podcastplayer from './podcastplayer.vue'

interface Track {
    src: string
    vtt: string
    title: string
    date: string
}

const playlist = ref<Track[]>([
    { src: '/audio/episode_13857.mp3', date: '21.11.2024', title: 'Kinder-, Jugend und Familienausschuss', vtt: '/audio/episode_13857.vtt' },
    { src: '/audio/episode_14084.mp3', date: '27.04.2025', title: 'Kommission zur Förderung der Inklusion von Menschen mit Behinderung', vtt: '/audio/episode_14084.vtt' },
    { src: '/audio/episode.mp3', date: '18.06.2025', title: 'Ausschusses für Verkehr und Mobilität', vtt: '/audio/episode.vtt' },
])

const currentIndex = ref(0)
const currentTrack = computed(() => {
    return playlist.value[currentIndex.value] || null
})

const playTrack = (index: number) => {
    if (index >= 0 && index < playlist.value.length) {
        currentIndex.value = index
    }
}

const onTrackEnded = () => {
    if (currentIndex.value < playlist.value.length - 1) {
        currentIndex.value++
    }
}
</script>

<template>

    <div class="podcast-wrapper">

        <Podcastplayer :current-track="currentTrack" @track-ended="onTrackEnded" />

        <div class="playlist">
            <div class="chapter" v-for="(track, idx) in playlist" :key="idx" @click="playTrack(idx)"
                :class="{ active: idx === currentIndex }">
                <span>{{ track.date }}</span>
                <span>{{ track.title }}</span>
            </div>
        </div>

    </div>

</template>

<style lang="scss" scoped>
.podcast-wrapper {
    @include mix.center($g: 8px);
    flex-direction: column;
    flex-wrap: wrap;
    background-color: #D9D9D9;
    width: 90vw;
    padding: 24px 16px;
    border-radius: 20px;
    max-width: 1080px;

    @media (max-width: 475px) {
        padding: 16px 8px;
    }
}

.playlist {
    @include mix.center($g: 8px);
    flex-direction: column;
    width: 100%;
    margin-top: 50px;
}

.chapter {
    @include mix.center($jc: space-between, $g: 8px);
    flex-direction: row;
    cursor: pointer;
    padding: 0.5em 1.5em;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    background-color: white;
    min-height: 70px;

    span {
        @media (max-width: 475px) {
            font-size: 14px;
        }
    }
}

.active {
    span {
        font-weight: 700;
        border: 2px dotted black;

        @media (max-width: 475px) {
            font-size: 15px;
        }
    }

}
</style>