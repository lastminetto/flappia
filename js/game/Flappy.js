function Flappy(bCount, speed, gravity, space, canvasWidth, canvasHeight) {

    this.score = 0;
    this.liveBirds = bCount;
    this.columnSpace = space;

    this.canvasHeight = canvasHeight;
    this.canvasWidth = canvasWidth;

    this.birdsCount = bCount;
    this.speed = speed;
    this.gravity = gravity;

    this.active = 0;
};

Flappy.prototype.start = function (canvasId) {

    this.genetic = new Genetic();
    this.genetic.createGenomes(this.birdsCount, 3, 1);

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

    this.info.update(objects.length, this.score, this.liveBirds, this.genetic.generation, this.genetic.fitness, this.active);

    for (let c = 0; c < this.columns.length; c++) {
        let column = this.columns[c];

        if (column.outOfBox) {
            this.columns.splice(c, 1);
            this.canvas.remove(column.topRect, column.bottomRect);
        }
    }

    for (let b = 0; b < this.birds.length; b++) {
        let bird = this.birds[b];

        if (bird.dead){
            this.canvas.remove(bird.bird);
            continue;
        }

        for (let c = 0; c < this.columns.length; c++)
            bird.crashWithColumn(this.columns[c]);

        bird.update();

        if (this.columns.length > 0) {
            this.genetic.executeGenome(b, bird.score);
            this.activateNetwork(b);
        }
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

    if (this.liveBirds <= 0) {
        this.end();
        this.genetic.prepareCrossOver();
    }
    else {
        this.canvas.renderAll();
        this.animation = requestAnimationFrame(this.loop.bind(this))
    }
};

Flappy.prototype.activateNetwork = function (birdIndex) {

    let bird = this.birds[birdIndex];

    bird.score = this.score;

    var input = bird.inputs(this.columns[0]);

    var active = this.genetic.activateNetwork(birdIndex, input);

    this.active = active[0];

    if (this.active >= 0.52)
        bird.flappy();

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
