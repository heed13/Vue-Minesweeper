<template>
    <div id="mine_settings" >
        <p>Mines: {{mines - numFlagged}}</p>

        <h1 v-if="victory">Victory!</h1>
        <div id="mine_board" v-bind:class="difficultyClass" v-once>
            <template v-for="n in rows" >
                <template v-for="k in cols">
                    <div v-bind:id="(n-1)+'_'+(k-1)"
                         v-on:click="handleSquareClick"
                         v-on:contextmenu.prevent="handleSquareMark"
                         :key="n+'_'+k"
                         class="square blank"
                         v-bind:posX="k-1"
                         v-bind:posY="n-1"></div>
                </template>
            </template>
        </div>
    </div>
</template>

<script>

    export default {
        name: "MineBoard",
        props: {
            rows: Number,
            cols: Number,
            mines: Number,
            difficultyClass: String
        },
        data(){
            return {
                victory: false,
                minePositions: [],
                flagged: [],
                numFlagged: 0,
                checked: [],
                STATES: {MINE: -1, BLANK: 0},
            }
        },
        created() {
        },

        methods: {
            setDefaults: function() {
                this.numFlagged = 0;
                this.flagged = [];
                this.checked = [];
                this.revealedBlocks = [];
                this.minePositions = [];

                // Create default 2d Board
                for (let i = 0; i < this.rows; i++) {
                    let row = [];
                    for (let j = 0; j < this.cols; j++) {
                        row.push(this.STATES.BLANK);
                    }
                    this.minePositions[i] = row;
                }
                // Default revealed board
                for (let i = 0; i < this.rows; i++) {
                    let row = [];
                    for (let j = 0; j < this.cols; j++) {
                        row.push(this.STATES.BLANK);
                    }
                    this.revealedBlocks[i] = row;
                }
                // Default flagged board
                for (let i = 0; i < this.rows; i++) {
                    let row = [];
                    for (let j = 0; j < this.cols; j++) {
                        row.push(this.STATES.BLANK);
                    }
                    this.flagged[i] = row;
                }
                // Default checked board
                for (let i = 0; i < this.rows; i++) {
                    let row = [];
                    for (let j = 0; j < this.cols; j++) {
                        row.push(this.STATES.BLANK);
                    }
                    this.checked[i] = row;
                }
            },
            createMines: function() {
                let minesLeft = this.mines;
                for (let i = 0; i < minesLeft; ++i) {
                    let duplicate = false;
                    let minePosX, minePosY;
                    do {
                        minePosX = Math.floor(Math.random() * this.cols);
                        minePosY = Math.floor(Math.random() * this.rows);
                        duplicate = this.isMine(minePosX, minePosY);
                    } while (duplicate);

                    this.minePositions[minePosY][minePosX] = this.STATES.MINE;
                    this.incrementAdjacentMineCount(minePosX, minePosY);
                }
            },
            reset: function() {
                this.victory = false;
                this.setDefaults();
                this.createMines();
                var divs = document.getElementsByClassName("square");
                for (let i = 0; i < divs.length; i++) {
                    divs[i].className = "square blank";
                }
                this.printBoard();
            },

            incrementAdjacentMineCount: function(x, y) {
                this.incrementMineCount(y-1,x-1); // Top-Left
                this.incrementMineCount(y-1,x); // Top
                this.incrementMineCount(y-1,x+1); // Top-Right

                this.incrementMineCount(y, x-1); // Left
                this.incrementMineCount(y,x+1); // Right

                this.incrementMineCount(y+1,x-1); // Bottom-Left
                this.incrementMineCount(y+1,x); // Bottom
                this.incrementMineCount(y+1,x+1); // Bottom-Right
            },
            incrementMineCount: function (y,x) {
                if (this.isInBounds(x,y) && !this.isMine(x, y)) {
                    this.minePositions[y][x] += 1;
                }
            },
            isInBounds: function(x,y) {
                return x >= 0 &&
                    y >= 0 &&
                    x < this.cols &&
                    y < this.rows;
            },
            isBlank: function(x,y) {
                return this.minePositions[y][x] === this.STATES.BLANK;
            },
            isMine: function(x,y) {
                return this.minePositions[y][x] === this.STATES.MINE;
            },
            isflagged: function(x,y) {
                return this.flagged[y][x] === 1;
            },
            isRevealed: function(x,y) {
                return this.checked[y][x] === 1;
            },
            handleSquareClick: function (e) {
                let square = e.target;
                console.log("clicked " + square.id);

                let x = parseInt(square.getAttribute("posX"));
                let y = parseInt(square.getAttribute("posY"));

                this.checked[y][x] = 1;

                // Event listeneres aren't removing so this is my solution to stop clicking on flagged items
                if (this.isflagged(x,y)) {
                    return;
                }

                if (this.isMine(x,y)) {
                    this.gameOver();
                    this.setMarkedMine(x,y);
                } else if (this.isBlank(x,y)) {
                    this.revealNineBlock(x,y);
                    this.checkVictory();
                } else {
                    this.revealBlock(square, x, y);
                    this.checkVictory();
                }
            },
            handleSquareMark: function(e) {
                // e.preventDefault();
                let square = e.target;
                console.log("toggled mark on " + square.id);

                let x = parseInt(square.getAttribute("posX"));
                let y = parseInt(square.getAttribute("posY"));

                if (this.isRevealed(x,y)) {
                    return;
                }

                this.toggleSquareMark(square, x, y);
                this.checkVictory();
            },
            toggleSquareMark: function(square,x,y) {
                if (this.isflagged(x,y)) {
                    this.flagged[y][x] = 0;
                    this.numFlagged -= 1;
                    square.classList.remove("flagged");
                    square.addEventListener('click', this.handleSquareClick);
                }
                else {
                    this.flagged[y][x] = 1;
                    this.numFlagged += 1;
                    square.classList.add("flagged");
                    square.removeEventListener('click', this.handleSquareClick);
                }
            },
            revealNineBlock: function(x,y) {
                this.checked[y][x] = 1;
                this.revealBlankSquare(y,x); // center square

                this.revealBlankSquare(y-1,x); // Top
                this.revealBlankSquare(y-1,x-1); // Top left
                this.revealBlankSquare(y-1,x+1); // Top right

                this.revealBlankSquare(y, x-1); // Left
                this.revealBlankSquare(y,x+1); // Right

                this.revealBlankSquare(y+1,x); // Bottom
                this.revealBlankSquare(y+1,x-1); // Bottom left
                this.revealBlankSquare(y+1,x+1); // Bottom right
            },
            revealBlankSquare: function(y,x){
                if (this.isInBounds(x,y)) {

                    this.revealBlock(this.getBlock(x,y), x, y);

                    if (!this.isRevealed(x,y) && this.isBlank(x,y)) {
                        this.revealNineBlock(x,y);
                    }
                    this.checked[y][x] = 1;

                }
            },
            getBlock: function(x,y) {
                return document.getElementById(y+"_"+x);
            },
            gameOver: function() {
                this.revealAllMines();

                // Prevent clicking anything else...
                for (let y = 0; y < this.rows; y++) {
                    for (let x = 0; x < this.cols; x++) {
                        this.flagged[y][x] = 1;
                    }
                }
            },
            setMarkedMine: function(x,y){
                var elem = document.getElementById(y+"_"+x);
                elem.classList.remove("mine");
                elem.classList.add("mine-clicked");
            },
            revealAllMines: function() {
                for (let y = 0; y < this.rows; y++) {
                    for (let x = 0; x < this.cols; x++) {
                        if (this.isMine(x,y)) {
                            let elem = document.getElementById(y+"_"+x);
                            this.revealBlock(elem, x,y);
                        }
                        else if (this.isflagged(x,y)) {
                            let elem = document.getElementById(y+"_"+x);
                            elem.classList.add("marked-wrong");
                        }
                    }
                }
            },
            revealBlock: function(squareElement, x, y) {
                squareElement.classList.remove("blank");
                var count = this.minePositions[y][x];
                var classStr = (this.minePositions[y][x] >= 0) ? "open" + count.toString() : "mine";
                squareElement.classList.add(classStr)
            },
            printBoard: function() {
                for (let y = 0; y < this.rows; y++) {
                    var str = "";
                    for (let x = 0; x < this.cols; x++) {
                        str += " " + this.minePositions[y][x];
                    }
                    console.log(str);
                }
            },
            checkVictory: function () {
                for (let y = 0; y < this.rows; y++) {
                    for (let x = 0; x < this.cols; x++) {
                        if (!this.isMine(x,y)) {
                            if (this.checked[y][x] !== 1) {
                                return false;
                            }
                        }
                    }
                }
                this.victory = true;
                console.log("Victory!");
            }
        }
    }
</script>

<style>
    #mine_board div {
        background-image: url("../assets/mine_sprites.gif");
    }
    .square {
        width: 32px;
        height: 32px;
        float: left;
    }
    .blank {
         background-position: 0 -78px;
     }
    .open0 {
        background-position: 0 -46px;
    }
    .open1 {
        background-position: -32px -46px;
    }
    .open2 {
        background-position: -64px -46px;
    }
    .open3 {
        background-position: -96px -46px;
    }
    .open4 {
        background-position: -128px -46px;
    }
    .open5 {
        background-position: -160px -46px;
    }
    .open6 {
        background-position: -192px -46px;
    }
    .open7 {
        background-position: -224px -46px;
    }
    .open8 {
         background-position: -256px -46px;
     }
    .mine {
        background-position: -128px -78px;
    }
    .mine-clicked {
        background-position: -64px -78px;
    }
    .flagged {
        background-position: -32px -78px;
    }
    .marked-wrong {
        background-position: -96px -78px;
    }

    #mine_board.easy {
        margin-left: 42.2%;
        width: 288px;
        height: 300px;
    }
    #mine_board.medium {
        margin-left: 37.2%;
        width: 512px;
        height: 512px;
    }
    #mine_board.expert {
        margin-left: 25.2%;
        width: 960px;
        height: 276px;
    }
</style>