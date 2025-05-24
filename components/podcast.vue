<script lang="ts" setup>
const config = useMusicfyPlayer({
    audio: {
        provider: "dropbox",
        preload: "none",
        id: "soep3xvq8aee4eh6hcj4r",
        rlkey: "g7sqo9y5zl3f69oxftzo5auc5"
    },
    image: {
        src: "https://dimatis.music/images/reminiscences.jpg",
        alt: "Dimatis - Reminiscences"
    },
    color: {
        detect: true
    }
})

</script>

<template>
    <div class="podcast-wrapper">
        <MusicfyPlayer :config="config" />
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
    flex-direction: column;
}
</style>