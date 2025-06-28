<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import type { VuePlyr } from '@skjnldsv/vue-plyr'

const plyrOptions = {
    controls: [
        'play',
        'progress',
        'current-time',
        'duration',
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

interface VTTCue {
    startTime: number
    endTime: number
    text: string
}

const props = defineProps<{
    currentTrack: Track | null
}>()

const emit = defineEmits<{
    trackEnded: [];
}>()

const { parseVTT, getCurrentCue, getAllText } = useVTTParser()

const plyrComponent = ref<any>(null)
const currentTime = ref<number>(0)
const cues = ref<VTTCue[]>([])
const showFullText = ref<boolean>(false)

const currentCue = computed(() => {
    if (cues.value.length === 0) return null
    return getCurrentCue(cues.value, currentTime.value)
})

const fullText = computed(() => {
    if (cues.value.length === 0) return ''
    return getAllText(cues.value)
})

const timeUpdateInterval = ref<NodeJS.Timeout | null>(null)

const onTimeUpdate = (event: any) => {
    try {
        if (event?.target?.currentTime !== undefined) {
            currentTime.value = event.target.currentTime
        }
    } catch (error) {
        console.warn('Fehler beim Abrufen der aktuellen Zeit:', error)
    }
}

const startTimeTracking = () => {
    if (timeUpdateInterval.value) {
        clearInterval(timeUpdateInterval.value)
    }

    timeUpdateInterval.value = setInterval(() => {
        if (plyrComponent.value?.player && !plyrComponent.value.player.paused) {
            currentTime.value = plyrComponent.value.player.currentTime || 0
        }
    }, 100)
}

const stopTimeTracking = () => {
    if (timeUpdateInterval.value) {
        clearInterval(timeUpdateInterval.value)
        timeUpdateInterval.value = null
    }
}

// Cleanup beim Unmount
onUnmounted(() => {
    stopTimeTracking()
})

const onTrackEnded = () => {
    stopTimeTracking()
    emit('trackEnded')
}

const toggleFullText = () => {
    showFullText.value = !showFullText.value
}

const loadVTTFile = async (vttSrc: string) => {
    try {
        const response = await fetch(vttSrc)
        const vttContent = await response.text()
        cues.value = parseVTT(vttContent)
    } catch (error) {
        console.error('Fehler beim Laden der VTT-Datei:', error)
        cues.value = []
    }
}

watch(() => props.currentTrack, (newTrack) => {
    if (newTrack?.vtt) {
        currentTime.value = 0
        showFullText.value = false

        if (plyrComponent.value?.player) {
            plyrComponent.value.player.pause()

            stopTimeTracking()

            plyrComponent.value.player.source = {
                type: 'audio',
                sources: [{
                    src: newTrack.src,
                    type: 'audio/mp3'
                }]
            }

            plyrComponent.value.player.once('loadeddata', () => {
                loadVTTFile(newTrack.vtt)
                startTimeTracking()
            })
        } else {
            loadVTTFile(newTrack.vtt)
        }
    } else {
        cues.value = []
        stopTimeTracking()
    }
}, { immediate: true })

onMounted(() => {
    if (props.currentTrack?.vtt) {
        loadVTTFile(props.currentTrack.vtt)
    }
})

</script>

<template>
    <div class="wrapper">

        <div class="player-title-wrapper">
            <div class="track-info" v-if="currentTrack">
                <h3>{{ currentTrack.title }}</h3>
            </div>

            <div class="audio-container">
                <VuePlyr ref="plyrComponent" :options="plyrOptions" @timeupdate="onTimeUpdate" @ended="onTrackEnded">
                    <audio>
                        <source :src="currentTrack?.src" type="audio/mp3" />
                    </audio>
                </VuePlyr>

                <button @click="toggleFullText" class="toggle-btn">
                    {{ showFullText ? 'Gesamttext ausblenden' : 'Gesamttext anzeigen' }}
                </button>
            </div>

        </div>


        <div class="content-container">
            <!-- Aktueller Text -->
            <div class="text" v-if="!showFullText">
                <h4>Aktueller Text:</h4>
                <div class="text-display" v-if="currentCue">
                    {{ currentCue.text }}
                </div>
            </div>

            <!-- Gesamter Text (optional anzeigen) -->
            <div class="text" v-else>
                <h4>Gesamter Audio Text:</h4>
                <div class="text-display">
                    {{ fullText }}
                </div>
            </div>

        </div>

    </div>
</template>

<style lang="scss" scoped>
.wrapper {
    @include mix.center($g: 20px);
    flex-direction: column;
    flex-wrap: wrap;
    width: 100%;
}

.player-title-wrapper {
    @include mix.center($jc: space-around);
    width: 100%;
    flex-wrap: wrap;

    div {
        width: 50%;
        height: 35vh;
        max-height: 350px;
        min-height: 250px;
        min-width: 400px;

        h3 {
            text-align: center;
            -webkit-text-stroke: 1.5px black;
            color: white;
        }
    }
}

.active {
    font-weight: bold;
}

:deep(.plyr) {
    margin: 1.5rem auto;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h3 {
    font-size: 26px;
    font-weight: 700;
}

h4 {
    font-size: 24px;
    font-weight: 500
}

.track-info {
    @include mix.center();

    flex-direction: column;
    padding: 10px;
    background-image: url('assets/images/podcast.jpg');
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    border: 5px solid white;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.content-container {
    @include mix.center();
    padding: 10px;
    background-color: white;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}


.audio-container {
    @include mix.center();
    flex-direction: column;
    min-width: 400px;
    padding: 10px;
}

.content-container {
    width: 100%;
}

.text {
    @include mix.center($g: 10px);
    flex-direction: column;
    width: 100%;
    padding: 10px;
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

button {
    all: unset
}

.text-display {
    letter-spacing: 1.4px;
    font-size: 18px;
}

.toggle-btn {
    padding: 10px 20px;
    border: 2px solid black;
    background-color: white;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    &:hover {
        cursor: pointer;
        scale: 1.05;
    }
}

@media (max-width: 475px) {

    .player-title-wrapper {
        div {
            width: 100%;

            min-height: 250px;
            min-width: unset;

            h3 {
                text-align: center;
                -webkit-text-stroke: 1.5px black;
                color: white;
            }
        }

        .audio-container {
            padding: 0;
        }

    }

    h4 {
        font-size: 18px;
    }

    .text-display {
        font-size: 14px;
        letter-spacing: unset;
    }
}
</style>