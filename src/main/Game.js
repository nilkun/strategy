'use strict'
import Screen from "./../engine/Screen.js"
import settings from "./Settings.js"
import GameWorld from "./GameWorld.js"
import Player from "./Player.js";
// import Tile from "./Tile.js";
import Map from "./Map.js"

export default class Game {
    constructor(width = 640, height = 400) {
        this.screen = new Screen(width, height);
        settings.init(width, height);
        this.gameWorld = new GameWorld;
        this.player = new Player;
        this.map = new Map(10, 10);
        this.map.tiles[5][5].color = "blue";
    }

    init() {
        console.log("initializing...", settings.width);
        console.log(this.map.tiles)
        // this.map.tiles[5][5].color = "blue";
        for(let i = 0; i < this.map.width; i++) {
            for(let j = 0; j < this.map.height; j++) {
                this.map.tiles[i][j].render(this.screen.context, .5, 5);
            }
        }
    }
}