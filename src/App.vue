<template>
    <div id="app">
        <label><b-form-checkbox v-model="darkMode" switch @change="toggleMode()" />Dark Mode</label>
        <Minesweeper/>
    </div>
</template>

<script>
    import Minesweeper from "@/components/Minesweeper";
    import {
        ADD_GOLD,
        DEFEATS,
        HINTS,
        INCREMENT_PAGELOADS,
        PAGELOADS,
        SET_COUNTER,
        TOTAL_GOLD,
        VICTORIES
    } from "@/store-constants";
    const LS_DARK_MODE = "darkmode";
    const DARK_MODE_CLASS = "darkmode";
    export default {
        name: 'App',
        components: {
            Minesweeper,
        },
        created() {

            let gold = this.getGoldFromLS();
            this.$store.commit(ADD_GOLD, gold);

            this.setCountsFromLS();
            this.$store.commit(INCREMENT_PAGELOADS);

            let darkmode = localStorage.getItem(LS_DARK_MODE);
            if (darkmode) {
                this.darkMode = JSON.parse(darkmode);
                if (this.darkMode) {
                    this.setDarkTheme();
                } else {
                    this.setLightTheme();
                }
            }
        },
        data() {
            return {
                darkMode: false,
            }
        },
        methods: {
            setCountsFromLS() {
                let victories = localStorage.getItem(VICTORIES);
                let defeats = localStorage.getItem(DEFEATS);
                let pageloads = localStorage.getItem(PAGELOADS);
                let hints = localStorage.getItem(HINTS);
                let totalGold = localStorage.getItem(TOTAL_GOLD);
                if (victories) {
                    this.$store.commit(SET_COUNTER, {counter: VICTORIES, amount: parseInt(victories)});
                }
                if (defeats) {
                    this.$store.commit(SET_COUNTER, {counter: DEFEATS, amount: parseInt(defeats)});
                }
                if (pageloads) {
                    this.$store.commit(SET_COUNTER, {counter: PAGELOADS, amount: parseInt(pageloads)});
                }
                if (hints) {
                    this.$store.commit(SET_COUNTER, {counter: HINTS, amount: parseInt(hints)});
                }
                if (totalGold) {
                    this.$store.commit(SET_COUNTER, {counter:TOTAL_GOLD, amount: parseInt(totalGold)});
                }
            },
            getGoldFromLS() {
                let gold = localStorage.getItem("gold_count");
                if (!gold)
                    return 0;

                return parseInt(gold);
            },
            toggleMode() {
                if (this.darkMode) {
                    this.setLightTheme();
                } else {
                    this.setDarkTheme();
                }
                localStorage.setItem(LS_DARK_MODE, JSON.stringify(!this.darkMode));
            },
            setDarkTheme() {
                document.body.classList.add(DARK_MODE_CLASS);
            },
            setLightTheme() {
                document.body.classList.remove(DARK_MODE_CLASS);
            }
        }
    }
</script>

<style>
    body {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        margin-top: 20px;
    }
    body:not(.darkmode) {
        color: #2c3e50;
    }
    body.darkmode {
        color: white;
        background-color: #272727;
    }
</style>
