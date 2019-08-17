function Column(width, height, gap, x, canvasHeight, fill, canvas) {

    this.x = x;
    this.width = width;

    this.outOfBox = false;

    this.topRect = new fabric.Rect({
        left: this.x,
        top: 0,        
        width: this.width,
        height: height,
        fill: fill,
        opacity: 0.7,
        hasControls: false,
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        lockUniScaling: true,
        transparentCorners: true
    });
    
    canvas.add(this.topRect);

    let bottomY = height + gap;
    let bottomHeigth = canvasHeight - height;

    this.bottomRect = new fabric.Rect({
        left: this.x,
        top: bottomY,
        width: this.width,
        height: bottomHeigth,
        fill: fill,
        opacity: 0.7,
        hasControls: false,
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        lockUniScaling: true,
        transparentCorners: true
    });

    canvas.add(this.bottomRect);    
}

Column.prototype.update = function (moveX) {

    this.x -= moveX;

    if (this.x < -this.width) {
        this.outOfBox = true;
        return;
    }

    this.topRect.set({ left: this.x });
    this.topRect.setCoords();

    this.bottomRect.set({ left: this.x });
    this.bottomRect.setCoords();
}