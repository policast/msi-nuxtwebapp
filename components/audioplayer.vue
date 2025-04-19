<script lang="ts" setup>
import { ref, computed } from 'vue';

const playerOpen = ref(false);
const previousState = ref(false);
const animating = ref(false);
const animationClass = computed(() => {
    if (!animating.value) return '';
    return playerOpen.value ? 'animate-growing' : 'animate-shrinking';
});

function togglePlayer() {
    previousState.value = playerOpen.value;
    animating.value = true;
    playerOpen.value = !playerOpen.value
}

function onAnimationEnd() {
    animating.value = false;
}
</script>

<template>

    <div class="player-wrapper" :class="[animationClass, playerOpen ? 'fullPlayer' : 'compactPlayer']"
        @animationend="onAnimationEnd">
        <div class="weekAndThemes">
            <div class="week"><img src="../assets/images/arrow.svg" @click="togglePlayer()"> #38</div>
            <div class="themes">
                <h5>Dein Podcast zu den Themen Schulwesen , Wirtschaft - Verkehr</h5>
            </div>
            <img class="playerButton" v-if="!playerOpen" src="../assets/images/play-circle.svg">
        </div>
        <div class="playStatus" v-if="playerOpen">
            <div class="currentPlayTime">00:00</div>
            <div class="playProgress">
                <div class="progress"></div>
            </div>
            <div class="fullPlayTime">10:00</div>
        </div>
        <div class="controll-buttons" v-if="playerOpen">
            <img class="playerButton" src="../assets/images/skip.svg">
            <img class="playerButton" src="../assets/images/play-circle.svg">
            <img class="next playerButton" src="../assets/images/skip.svg">
        </div>
    </div>

</template>

<style lang="scss" scoped>
.player-wrapper {
    @include mix.center($g: 8px);
    flex-wrap: wrap;
    width: 100%;
    padding: 8px;
    border-radius: 20px;
    border: 2px solid black;
}

.weekAndThemes {
    @include mix.center($jc: space-between, $g: 0px);
    font-size: 20px;
    width: 100%;
}

.week {
    @include mix.center($g: 8px);
    width: 20%;
    font-weight: 700;

    img {
        cursor: pointer;
    }
}

.themes {
    width: 65%;
    text-align: center;
}

.playerButton {
    cursor: pointer;
    padding: 10px;
    max-width: 80px;
    aspect-ratio: 1/1;
    
    &:active{
        scale: 0.8;
    }
}

.next{
    rotate: 180deg;
}

.animate-growing {
    animation: grow 0.5s ease-in-out;
}

.animate-shrinking {
    height: 300px;
    animation: shrink 0.5s ease-in-out;
}

.fullPlayer {
    padding-top: 6px;
    height: 300px;

    .weekAndThemes {
        justify-content: flex-start;
        .week {
            img {
                rotate: 180deg;
            }
        }

        .themes {}
    }
}

.compactPlayer {
    height: 88px;
}

.playStatus {
    @include mix.center($jc: flex-start, $g:10px);
    width: 95%;
    height: 20px;

    .currentPlayTime,
    .fullPlayTime {
        width: 10%;
        text-align: center;
    }

    .playProgress {
        @include mix.center($jc: flex-start);
        width: 80%;
        height: 20px;
        border: solid 2px black;
        border-radius: 15px;
        .progress{
            width: 55%;
            height: 90%;
            background-color: white;
            border-radius: 15px;
        }
    }
}

.controll-buttons{
    @include mix.center();
}
</style>
