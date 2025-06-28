<template>
    <nav>
        <section class="logo-section">
            <logo />
        </section>
    </nav>
    <div>
        <section class="show-picked-podcasts center">
            <Podcast />
        </section>
    </div>
</template>

<script setup>
useHead({
    titleTemplate: "Münster Interessiert's",
})
</script>

<style lang="scss">
.center {
    @include mix.center();
    padding: 20px 0;
}
</style>