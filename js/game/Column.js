function Column(width, height, gap, x, canvasHeight, fill, ctx) {

    this.width = width;
    this.height = height;
    this.gap = gap;

    this.x = x;
    this.canvasHeight = canvasHeight;

    this.bottomY = this.height + this.gap;
    this.bottomHeigth = this.canvasHeight - this.height;

    this.fill = fill;

    this.context = ctx;

    this.outOfBox = false;
}

Column.prototype.update = function (moveX) {

    this.x -= moveX;

    if (this.x < -this.width) {
        this.outOfBox = true;
        return;
    }

    this.context.fillStyle = this.fill;

    this.context.fillRect(this.x, 0, this.width, this.height);
    this.context.fillRect(this.x, this.bottomY, this.width, this.bottomHeigth);
}

Column.prototype.bounds = function () {
    return [
        [this.x, 0, this.x + this.width, this.height],
        [this.x, this.bottomY, this.x + this.width, this.height + this.gap + this.bottomHeigth]
    ];
}