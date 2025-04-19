<script lang="ts" setup>
const { state, audioFiles } = useAudioState();

</script>

<template>
    <div class="podcast-wrapper">
        <audioplayer v-if="audioFiles.length > 0" :audio-files="audioFiles" />
        <p v-else>Wähle mindestens ein Thema aus, um den Podcast zu hören.</p>
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