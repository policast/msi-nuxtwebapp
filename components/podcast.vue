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

</script>

<template>
    <div class="podcast-wrapper space-y-6">


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