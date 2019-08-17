function Flappy(bCount, speed, gravity, space, canvasWidth, canvasHeight) {

    this.score = 0;
    this.liveBirds = bCount;
    this.columnSpace = space;

    this.canvas = null;
    this.animation = null;
    this.info = null;

    this.canvasHeight = canvasHeight;
    this.canvasWidth = canvasWidth;

    this.birdsCount = bCount;
    this.speed = speed;
    this.gravity = gravity;
};

Flappy.prototype.start = function (canvasId) {

    this.canvas = new fabric.Canvas(canvasId);
    this.canvas.setWidth(this.canvasWidth);
    this.canvas.setHeight(this.canvasHeight);

    this.canvas.on('mouse:down', (function () {
        for (let i = 0; i < this.birdsCount; i++)
            this.birds[i].flappy();
    }).bind(this), false);

    this.restart();

};

Flappy.prototype.restart = function () {

    this.birds = [];
    this.columns = [];
    this.score = 0;

    this.canvas.remove(...this.canvas.getObjects());

    this.info = new Info(this.canvas);

    let startX = 5;
    let startY = (this.canvas.height / 2) - 10;

    for (let i = 0; i < this.birdsCount; i++)
        this.birds.push(new Bird(startX, startY, this.gravity, "red", this.canvas));

    this.loop();
};

Flappy.prototype.loop = function () {

    this.score += 1;

    let objects = this.canvas.getObjects();

    this.info.update(objects.length, this.score, this.liveBirds);

    for (let c = 0; c < this.columns.length; c++) {
        let column = this.columns[c];

        if (column.outOfBox) {
            let column = this.columns.splice(c, 1);
            this.canvas.remove(column.topRect, column.bottomRect);
        }
    }

    for (let b = 0; b < this.birds.length; b++) {
        let bird = this.birds[b];

        if (bird.dead)
            continue;

        for (let c = 0; c < this.columns.length; c++)
            bird.crashWithColumn(this.columns[c]);

        //TODO: Put IA

        bird.update();
    }

    this.liveBirds = this.birds.filter(x => !x.dead).length;

    if (this.score == 1 || (this.score / this.columnSpace) % 1 == 0) {

        let width = this.canvas.width;
        let height = this.canvas.height - 100;

        let columnHeight = this.rnd(10, height - 10);

        let column = new Column(35, columnHeight, 100, width, height, "green", this.canvas);
        this.columns.push(column);
    }

    for (let c = 0; c < this.columns.length; c++) {
        let column = this.columns[c];

        column.update(this.speed);
    }

    if (this.liveBirds <= 0)
        this.end();
    else {
        this.canvas.renderAll();
        this.animation = requestAnimationFrame(this.loop.bind(this))
    }
};

Flappy.prototype.end = function () {
    cancelAnimationFrame(this.animation);

    setTimeout(() => {
        this.restart();
    }, 500);
};

Flappy.prototype.rnd = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
};
