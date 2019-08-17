function Bird(x, y, gravity, fill, canvas) {

    this.y = y;
    this.score = 0;
    this.canvas = canvas;
    this.gravity = gravity;

    this.dead = false;

    this.bird = new fabric.Rect({
        left: x,
        top: this.y,
        width: 20,
        height: 20,
        fill: fill,
        opacity: 1,
        hasControls: false,
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        lockUniScaling: true,
        transparentCorners: true
    });

    this.canvas.add(this.bird);
};

Bird.prototype.crashWithColumn = function (column) {

    if (this.bird.intersectsWithObject(column.topRect))
        this.dead = true;

    if (this.bird.intersectsWithObject(column.bottomRect))
        this.dead = true;

    if (this.canvas.height <= (this.bird.top + 20) || this.bird.top <= 0)
        this.dead = true;
};

Bird.prototype.update = function () {
    this.y += this.gravity;

    this.bird.set({ top: this.y });
    this.bird.setCoords();
};

Bird.prototype.flappy = function () {
    this.y -= 50;
};

Bird.prototype.inputs = function (column) {

    let birdBounds = this.bird.getCenterPoint();
    let columnBounds = column.bottomRect.getBoundingRect();

    let distanciaTopoColuna = birdBounds.y - columnBounds.top;
    let distanciaColuna = columnBounds.left + columnBounds.width;

    return [
        this.dead,
        distanciaTopoColuna,
        distanciaColuna
    ];
};