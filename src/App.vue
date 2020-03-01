<template>
    <div id="app">
        <Minesweeper/>
    </div>
</template>

<script>
    import Minesweeper from "@/components/Minesweeper";
    import {ADD_GOLD} from "@/store-constants";

    export default {
        name: 'App',
        components: {
            Minesweeper,
        },
        created() {
            let gold = this.getGoldFromLS();
            this.$store.commit(ADD_GOLD, gold);
        },
        methods: {
            getGoldFromLS() {
                let gold = localStorage.getItem("gold_count");
                if (!gold)
                    return 0;

                return parseInt(gold);
            }
        }
    }
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        margin-top: 20px;
    }
</style>
