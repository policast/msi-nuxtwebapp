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
    trackEnded: []
}>()

const { parseVTT, getCurrentCue, getAllText } = useVTTParser()

const plyrComponent = ref<any>(null)
const currentTime = ref<number>(0)
const cues = ref<VTTCue[]>([])
const showFullText = ref<boolean>(false)
const timeUpdateInterval = ref<number | null>(null)

const currentCue = computed(() => {
    if (cues.value.length === 0) return null
    return getCurrentCue(cues.value, currentTime.value)
})

const fullText = computed(() => {
    if (cues.value.length === 0) return ''
    return getAllText(cues.value)
})

// Methods
const onTimeUpdate = (event: any) => {
    try {
        if (event?.target?.currentTime !== undefined) {
            currentTime.value = event.target.currentTime
        }
    } catch (error) {
        console.warn('Fehler beim Abrufen der aktuellen Zeit:', error)
    }
}

const onTrackEnded = () => {
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
        loadVTTFile(newTrack.vtt)

        currentTime.value = 0
        showFullText.value = false
    } else {
        cues.value = []
    }
}, { immediate: true })

onMounted(() => {
    if (props.currentTrack?.vtt) {
        loadVTTFile(props.currentTrack.vtt)
    }
})
</script>

<template>

    <div class="podcast-player">
        <div class="audio-container">
            <VuePlyr ref="plyrComponent" :options="plyrOptions" @timeupdate="onTimeUpdate" @ended="onTrackEnded">
                <audio>
                    <source :src="currentTrack?.src" type="audio/mp3" />
                </audio>
            </VuePlyr>
        </div>

        <!-- Track Info -->
        <div class="track-info" v-if="currentTrack">
            <h3>{{ currentTrack.title }}</h3>
            <p class="track-date">{{ currentTrack.date }}</p>
        </div>

        <div class="content-container">
            <!-- Aktueller Text -->
            <div class="current-text">
                <h4>Aktueller Text:</h4>
                <div class="text-display" v-if="currentCue">
                    {{ currentCue.text }}
                </div>
                <div v-else class="no-text">
                    Kein Text für aktuelle Position verfügbar
                </div>
            </div>

            <!-- Gesamter Text (optional anzeigen) -->
            <div class="full-text" v-if="showFullText">
                <h4>Gesamter Text:</h4>
                <div class="text-display full">
                    {{ fullText }}
                </div>
            </div>

            <button @click="toggleFullText" class="toggle-btn">
                {{ showFullText ? 'Gesamttext ausblenden' : 'Gesamttext anzeigen' }}
            </button>
        </div>
    </div>

</template>

<!-- TODO: li elemente so anpassen , mit Detail anzeigen der Folgen , evtl "Aktiv setzten" mit erweiterten Details , andere verkleinert mit Title  / Datum nur -->
 <!-- TODO: Untertitel design / Einheitliche größe player und text reichweise, Text ansicht als volltext 'lesbarer' machen   -->

<style lang="scss" scoped>
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