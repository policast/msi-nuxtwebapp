<template>
    <div class="logo-wrapper">
        <img src="../assets/images/logo.svg">
        <div class="logo-text-wrapper">
            <h1>Münster Interessiert's</h1>
            <h3>Dein Info-Podcast aus dem Rat</h3>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.logo-wrapper {
    @include mix.center($g:10px);
    flex-direction: row;
    padding: 15px ;
    margin-top: 10px;

    .logo-text-wrapper{
        @include mix.center($jc:flex-start,  $ai:flex-start);
        flex-direction: column;
    }

    img {
        height: 50px;
        width: 56px;
    }

    h1 {
        font-size: 22px;
        font-weight: 700;
        letter-spacing: 5px;
    }

    h3 {
        margin-top: -8px;
        font-size: 23px;
        font-weight: 200;
        word-spacing: 5px;
        letter-spacing: 8px;
    }
}
</style>
