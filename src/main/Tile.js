export default class Tile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = "green";
    }
    render(renderer, xOffset = 0, yOffset = 0, size = 20) {
        renderer.beginPath();
        renderer.fillStyle = this.color;
        renderer.strokeStyle = "black";
        renderer.rect(
            (this.x + xOffset) * size, 
            (this.y + yOffset) * size, 
            size,
            size
        );
        renderer.fill();
        renderer.stroke();
    }
}