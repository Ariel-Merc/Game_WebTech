"use strict";
const app = new PIXI.Application({
    width: 864,
    height: 540
});
document.body.appendChild(app.view);

// dimensions
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

// pre-load the images (this code works with PIXI v6)
app.loader.
    add([
        "../images/background_0.png",
        "../images/background_1.png",
        "../images/background_2.png",
        "../images/Cat-2/Cat-2-Walk.png",
        "../images/jumpBG.png"
    ]);
app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
app.loader.onComplete.add(setup);
app.loader.load();

// aliases
let stage;

// game variables
let startScene;
let gameScene, layerOne, layerTwo, layerThree, layerFour, star, scoreLabel, lifeLabel, jumpSound, collectSound;
let gameOverScene;

let stars = [];
let score = 0;
let gameOverScoreLabel;
let catTextures;
let cats = [];
let lives = 50;
let levelNum = 1;
let paused = true;

function setup() {
    stage = app.stage;
    
    // Create start scene
    startScene = new PIXI.Container();
    startScene.visible = false;
    stage.addChild(startScene);
    

    // Create game scene
    gameScene = new PIXI.Container();
    gameScene.visible = true;
    stage.addChild(gameScene);

    // #3 - Create the `gameOver` scene and make it invisible
    gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);

    // #4 - Create labels for all 3 scenes
    //createLabelsAndButtons();
    
    // create background
    layerOne = new FirstLayer();
    gameScene.addChild(layerOne);
    layerTwo = new SecondLayer();
    gameScene.addChild(layerTwo);
    layerThree = new ThirdLayer();
    gameScene.addChild(layerThree);
    layerFour = new SceneLayer();
    gameScene.addChild(layerFour);
    
    // Create player
    // player = new Player();
    // gameScene.addChild(player);

    // UGHHHHHHH
    catTextures = loadSpriteSheet();
    createCat(0,0,25,25);
    

    // Load Sounds
    // shootSound = new Howl({
    //     src: ['sounds/shoot.wav']
    // });

    // // #7 - Load sprite sheet
    // explosionTextures = loadSpriteSheet();

    // // #8 - Start update loop
    // app.ticker.add(gameLoop);

    // // #9 - Start listening for click events on the canvas
    // app.view.onclick = fireBullet;

    // Now our `startScene` is visible
    // Clicking the button calls startGame()
}

function loadSpriteSheet(){
    let spriteSheet = PIXI.BaseTexture.from("../images/Cat-2/Cat-2-Walk.png");
    let width = 50;
    let height = 50;
    console.log(height);
    let numFrames = 8;
    let textures = [];
    for (let i=0; i<numFrames; i++){
        let frame = new PIXI.Texture(spriteSheet, new PIXI.Rectangle(i*width, 50, width, height));
        textures.push(frame);
    }
    return textures;
}

function createCat(x, y, frameWidth, frameHeight){
    let w2 = frameWidth/2;
    let h2 = frameHeight/2;
    let catAnim = new PIXI.AnimatedSprite(catTextures);
    catAnim.x = x- w2;
    catAnim.y = y - h2;
    catAnim.animatedSpeed = 1/7;
    catAnim.loop = true;
    //catAnim.onComplete = e => gameScene.removeChild(catAnim);
    cats.push(catAnim);
    gameScene.addChild(catAnim);
    catAnim.play();
}