function Flappy(bCount, speed, gravity, space, canvasWidth, canvasHeight) {

    this.frame = 0;
    this.liveBirds = bCount;
    this.columnSpace = space;

    this.canvas = null;
    this.context = null;
    this.animation = null;
    this.info = null;

    this.canvasHeight = canvasHeight;
    this.canvasWidth = canvasWidth;

    this.birds = [];
    this.columns = [];

    this.birdsCount = bCount;
    this.speed = speed;
    this.gravity = gravity;
};

Flappy.prototype.end = function () {
    cancelAnimationFrame(this.animation);
}

Flappy.prototype.start = function (canvasId) {

    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");

    this.info = new Info(this.context);
    
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;

    let startX = 5;
    let startY = (this.canvas.height / 2) - 10;

    for (let i = 0; i < this.birdsCount; i++)
        this.birds.push(new Bird(startX, startY, this.gravity, "red", this.context));

    this.canvas.addEventListener('click', (function () {
        for (let i = 0; i < this.birdsCount; i++)
            this.birds[i].flappy();
    }).bind(this), false);

    this.loop();
};

Flappy.prototype.loop = function () {

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.frame += 1;

    this.info.update(this.frame);

    for (let c = 0; c < this.columns.length; c++) {
        let column = this.columns[c];

        if (column.outOfBox)
            this.columns.splice(c, 1);
    }

    for (let b = 0; b < this.birds.length; b++) {
        let bird = this.birds[b];

        if (bird.dead)
            continue;

        for (let c = 0; c < this.columns.length; c++) {
            let column = this.columns[c];

            if (bird.crashWith(column)) {
                bird.dead = true;

                this.liveBirds--;
            }
        }

        //TODO: Put IA

        bird.update();
    }

    if (this.frame == 1 || (this.frame / this.columnSpace) % 1 == 0) {

        let width = this.canvas.width;
        let height = this.canvas.height - 100;

        let columnHeight = this.rnd(10, height - 10);

        let column = new Column(35, columnHeight, 100, width, height, "green", this.context);
        this.columns.push(column);
    }

    for (let c = 0; c < this.columns.length; c++) {
        let column = this.columns[c];

        column.update(this.speed);
    }

    if (this.liveBirds <= 0)
        this.end();
    else
        this.animation = requestAnimationFrame(this.loop.bind(this));
};

Flappy.prototype.rnd = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
