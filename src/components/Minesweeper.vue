<template>
    <div id="minesweeper">
        <h1>Minesweeper</h1>
        <button v-on:click="reset">Reset</button>

        <MineBoard v-if="difficulty === 0"
                ref="board"
                v-bind:rows="settings.rows"
                v-bind:cols="settings.cols"
                v-bind:mines="settings.mines"
                v-bind:difficultyClass="settings.difficultyClass"/>

    </div>
</template>

<script>
    import MineBoard from "@/components/MineBoard";

    const EASY_SETTINGS = {rows: 9, cols: 9, mines: 10, difficultyClass: "easy"};
    const MEDIUM_SETTINGS = {rows: 16, cols: 16, mines: 40, difficultyClass: "medium"};
    const EXPERT_SETTINGS = {rows: 16, cols: 30, mines: 99, difficultyClass: "expert"};

    export default {
        name: "Minesweeper",
        components: {MineBoard},
        data: function() {
            return {
                settings: EXPERT_SETTINGS,
                difficulty: 0,
            };
        },
        mounted() {
            this.$refs.board.reset();
        },
        methods: {
            reset: function() {
                this.$refs.board.reset();
            },
            setDifficulty(i) {
                this.difficulty = i;
                this.settings = EASY_SETTINGS;
                this.settings = MEDIUM_SETTINGS;
                this.settings = EXPERT_SETTINGS;

            }
        }
    }
</script>

<style scoped>

</style>