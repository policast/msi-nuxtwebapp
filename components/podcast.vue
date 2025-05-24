<script setup lang="ts">
interface Episode {
    src: string
    image: { src: string; alt: string }
}

// Basis-Config, die für alle Player gleich bleibt
const baseConfig = {
    color: { detect: true }
}

// Episode-Daten
const episodes: Episode[] = [
    {
        src: '/audio/episode_13857.mp3',
        image: {
            src: 'https://dimatis.music/images/reminiscences.jpg',
            alt: 'Dimatis – Reminiscences'
        }
    },
    {
        src: '/audio/episode_14084.mp3',
        image: {
            src: 'https://dimatis.music/images/reminiscences.jpg',
            alt: 'Dimatis – Another Track'
        }
    },
]

const configs = episodes.map(ep =>
    useMusicfyPlayer({
        audio: {
            provider: 'local',
            src: ep.src,
            type: 'audio/mpeg',
            preload: 'auto'
        },
        image: ep.image,
        ...baseConfig
    })
)
</script>

<template>
    <div class="podcast-wrapper space-y-6">

        <div v-for="(cfg, idx) in configs" :key="idx" class="player-item">
            <MusicfyPlayer :config="cfg" width="100%"/>
        </div>

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


// :deep(.mp__cover) {
//   display: none !important;
//   max-width: 50%;
// }

// :deep(.mp__box) {
//   width: 100%;
// }


</style>