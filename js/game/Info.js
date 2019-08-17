function Info(canvas) {

    this.canvas = canvas;

    this.text = new fabric.Text("Score 0", {
        fontFamily: "Arial",
        fillStyle: "black",
        fontSize: 10,
        left: 10,
        top: 20,
        hasControls: false,
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        lockUniScaling: true,
        transparentCorners: true
    });

    this.canvas.add(this.text);
}

Info.prototype.update = function (objects, score, birds, generation, fitness, active) {

    this.text.set({text: `Objects ${objects} | Score ${score} | Birds ${birds} | Generation ${generation} | Fitness ${fitness} | Active ${active}`});

}