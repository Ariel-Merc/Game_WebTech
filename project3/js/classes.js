class Player extends PIXI.Sprite {
    constructor(x=0, y=0) {
        // get the character asset
        super(app.loader.resources["../images/Cat-2/cat.png"].texture);
        this.anchor.set(.5, .5);
        this.scale.set(3);
        this.x = x;
        this.y = y;
    }
}

class Star extends PIXI.Sprite {
    constructor(x=0, y=0) {
        // get the character asset
        super(app.loader.resources["../images/star.png"].texture);
        this.anchor.set(.5, .5);
        this.scale.set(0.1);
        this.x = x;
        this.y = y;

        // variables
        this.isAlive = true;
    }

}

class Cloud extends PIXI.Sprite {
    constructor(x=0, y=0) {
        // get the character asset
        super(app.loader.resources["../images/cloud.png"].texture);
        this.anchor.set(.5, .5);
        this.scale.set(2);
        this.x = x;
        this.y = y;
    }

}

class Sample extends PIXI.Sprite {
    constructor(x=50, y=90) {
        // get the character asset
        super(app.loader.resources["../images/sample.png"].texture);
        this.anchor.set(0, 0);
        this.scale.set(0.5);
        this.x = x;
        this.y = y;
    }

}



class FirstLayer extends PIXI.Sprite {
    constructor(x=0, y=0) {
        // get the background asset
        super(app.loader.resources["../images/background_0.png"].texture);
        this.anchor.set(0, 0);
        this.scale.set(3);
        this.x = x;
        this.y = y;
    }
}

class SecondLayer extends PIXI.Sprite {
    constructor(x=0, y=0) {
        // get the background asset
        super(app.loader.resources["../images/background_1.png"].texture);
        this.anchor.set(0, 0);
        this.scale.set(3);
        this.x = x;
        this.y = y;
    }
}

class ThirdLayer extends PIXI.Sprite {
    constructor(x=0, y=0) {
        // get the background asset
        super(app.loader.resources["../images/background_2.png"].texture);
        this.anchor.set(0, 0);
        this.scale.set(3);
        this.x = x;
        this.y = y;
    }
}

class SceneLayer extends PIXI.Sprite {
    constructor(x=0, y=15) {
        // get the background asset
        super(app.loader.resources["../images/jumpBG.png"].texture);
        this.anchor.set(0, 0);
        this.scale.set(3);
        this.x = x;
        this.y = y;
    }
}

class Box extends PIXI.Graphics{
    constructor(color=0xFFFFFF, x=0, y=0){
        super();
        this.beginFill(color);
        this.drawRect(50,50,100,100);
        this.endFill();
        this.x = x;
        this.y = y;
    }
}
