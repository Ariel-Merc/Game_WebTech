"use strict";
const app = new PIXI.Application({
    width: 900,
    height: 800
});
document.body.appendChild(app.view);

// dimensions
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

// aliases
let stage;

// game variables
let startScene;
let gameScene, star, scoreLabel, lifeLabel, jumpSound, collectSound;
let gameOverScene;

let stars = [];
let score = 0;
let gameOverScoreLabel;
let lives = 50;
let levelNum = 1;
let paused = true;

function setup() {
    stage = app.stage;
    
    // Create start scene
    startScene = new PIXI.Container();
    stage.addChild(startScene);

    // Craete game scene
    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);

    // #3 - Create the `gameOver` scene and make it invisible
    gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);

    // #4 - Create labels for all 3 scenes
    createLabelsAndButtons();

    // Create player
    player = new Player();
    gameScene.addChild(player);

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