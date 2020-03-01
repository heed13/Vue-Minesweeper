<template>
    <div class="container">
        <div id="minesweeper" class="mx-auto">
            <h1 class="text-center">Minesweeper</h1>

            <b-button-toolbar key-nav aria-label="Actions" class="mx-auto">
                <b-button-group class="mx-auto">
                    <b-button variant="success" :disabled="!canHint" @click="hint" size="lg" title="prioritizes blanks and then any non-mine">Hint (${{hintPrice}})</b-button>
                    <b-button variant="primary" class="ml-5" @click="reset" size="lg">Reset</b-button>
                </b-button-group>

                <b-button-group class="mx-auto">
                    <b-input-group size="lg" append="gold" class="w-75">
                        <b-form-input :value="goldCount" class="text-right" disabled title="spend it wisely, once you win it's gone."></b-form-input>
                    </b-input-group>
                    <span id="info_btn" class="info-btn" >&#9432;</span>
                    <b-popover triggers="hover" placement="right" target="info_btn">
                        <template v-slot:title>Gold Policy</template>
                        Minesweeper Incorporated offers employees 1 gold per correctly marked flags.
                        However, money is only extended as a part of our family friendly life insurance policy and as
                        such will not be given out until the time of your inevitable death.
                        Should you not die, and in fact sweep all the mines, Minesweeper Incorporated reserves the right to
                        take back any and all gold extended to participants.
                        <br/>
                        <span>----------------------------</span>
                        <br/>
                        <strong>1 gold</strong> per correctly <strong>flagged mine</strong>.<br/>
                        Given out only when you <strong>lose</strong>.<br/>
                        All gold taken away when you <strong>win</strong>.
                    </b-popover>
                    <!--                    <b-button variant="outline-primary" disabled size="lg">Gold: <b-badge variant="warning">${{goldCount}}</b-badge></b-button>-->
                </b-button-group>

            </b-button-toolbar>

            <div>
                <MineBoard v-if="difficulty === 0"
                    ref="board"
                    v-bind:rows="settings.rows"
                    v-bind:cols="settings.cols"
                    v-bind:mines="settings.mines"
                    v-bind:difficultyClass="settings.difficultyClass"/>
            </div>
        </div>
    </div>
</template>

<script>
    import MineBoard from "@/components/MineBoard";
    import {GET_GOLD, HAS_ENOUGH_GOLD, SPEND_GOLD} from "@/store-constants";

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
                hintPrice: 25,
            };
        },
        computed: {
            goldCount() {
                return this.$store.getters[GET_GOLD];
            },
            canHint() {
                return this.goldCount >= this.hintPrice;
            }
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

            },
            hint() {
                if (this.$store.getters[HAS_ENOUGH_GOLD], this.hintPrice) {
                    this.$store.commit(SPEND_GOLD, this.hintPrice);
                    this.$refs.board.hint();
                }
            }
        }
    }
</script>

<style scoped>
.info-btn{
    font-weight: bold;
    color: deepskyblue;
    margin-left: 5px;
}
.info-btn:hover {
    cursor: pointer;
}
    button:disabled {
        cursor: default;
    }
</style>