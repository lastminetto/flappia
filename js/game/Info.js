function Info(context) {

    this.context = context;

}

Info.prototype.update = function (score) {

    this.context.globalCompositeOperation = 'destination-before';
    this.context.fillStyle = "black";
    this.context.font = "10px Arial";
    this.context.strokeText(`Score ${score}`, 10, 20);

}