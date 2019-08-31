export default class City {
    constructor(name, x, y, owner = undefined) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.owner = owner;
        this.population = 0;
    }
    update() {
        this.population += 1;
    }
}