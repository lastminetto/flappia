function Bird(x, y, gravity, fill, context) {

    this.posX = x;
    this.posY = y;
    this.fill = fill;

    this.width = 20;
    this.height = 20;

    this.dead = false;

    this.gravity = gravity;

    this.context = context;
}

Bird.prototype.bounds = function () {
    return [
        this.posX,
        this.posY,
        this.posX + this.width,
        this.posY + this.height
    ];
}

Bird.prototype.crashWith = function (column) {

    const birdBounds = this.bounds();
    const columnBounds = column.bounds();

    let intersect = false;

    for (let i = 0; i < columnBounds.length; i++) {

        if (intersect)
            continue;

        let b = birdBounds;
        let c = columnBounds[i];

        intersect = !(c[0] > b[2] || c[2] < b[0] || c[1] > b[3] || c[3] < b[1]);
    }

    if (birdBounds[1] <= 0 || birdBounds[1] >= columnBounds[1][3] || birdBounds[3] <= 0 || birdBounds[3] >= columnBounds[1][3])
        return true;

    return intersect;
}

Bird.prototype.update = function () {

    this.context.fillStyle = this.fill;

    this.posY += this.gravity;

    this.context.globalCompositeOperation = 'destination-over';
    this.context.fillRect(this.posX, this.posY, this.width, this.height);
}

Bird.prototype.flappy = function () {
    this.posY -= 70;
};