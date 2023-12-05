class Player extends PIXI.Sprite {
    constructor(x=0, y=0) {
        // get the character asset
        // super(app.loader.resources["images/spaceship.png"].texture);
        // this.anchor.set(.5, .5);
        // this.scale.set(0.1);
        // this.x = x;
        // this.y = y;
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