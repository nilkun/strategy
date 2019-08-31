import Tile from "./Tile.js";

export default class Map {
    constructor(width = 20, height = 20) {
        this.width = width;
        this.height = height;
        this.tiles = new Array(width);
        for(let i = 0; i < width; i++) {
            this.tiles[i] = new Array(height);
            for(let j = 0; j < height; j++) {
                this.tiles[i][j] = new Tile(i, j);
            }
        }
    }
    render() {

    }
}