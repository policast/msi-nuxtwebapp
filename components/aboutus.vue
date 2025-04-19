<template>
    <div class="aboutUs-wrapper">
        <h2>Über Münster Interessiert's</h2>
        <div class="about-video">

            <iframe class="ms-Hack-Video"
                src="https://www.youtube.com/embed/OuShG0X0udw?si=Gom9cHgs-deTD8iF&amp;start=2953"
                title="YouTube video player" frameborder="0" allow="accelerometer; 
    ; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

            <div class="about-us">
                <p>Unserer Antrieb ist...</p>
                <p>Wir suchen ...</p>
                <p>Was brauchen wir..</p>
            </div>
        </div>

        <div class="buttonreturntothemes"></div>
    </div>
</template>

<style lang="scss" scoped>
.aboutUs-wrapper {
    @include mix.center();
    flex-direction: column;
    background-color: #D9D9D9;
    width: 90vw;
    padding: 24px;
    border-radius: 20px;
}

h2 {
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 32px
}

.about-video {
    @include mix.center($jc: space-between);
    width: 100%;

    iframe{
        width: 50%;
    }

    .about-us {
        @include mix.center();
        flex-direction: column;
        text-align: center;
        width: 50%;
    }
}

.ms-Hack-Video {
    width: 40vw;
    height: 40vh;
    border: solid 2px black;
    border-radius: 20px;
}
</style>

<script setup lang="ts">

</script>