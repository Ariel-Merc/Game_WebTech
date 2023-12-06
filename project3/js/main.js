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
        "../images/Cat-2/cat.png",
        "../images/jumpBG.png"
    ]);
app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
app.loader.onComplete.add(setup);
app.loader.load();

// aliases
let stage;

// game variables
let startScene;
let gameScene, layerOne, layerTwo, layerThree, layerFour, player, star, scoreLabel, lifeLabel, jumpSound, collectSound;
let gameOverScene;

let stars = [];
let score = 0;
let gameOverScoreLabel;
let catTextures;
let cats = [];
let lives = 50;
let levelNum = 1;
let paused = true;
let isJumping = false;
let jumpCount = 0;

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
    player = new Player();
    gameScene.addChild(player);

    // #4 - Create labels for all 3 scenes
    createLabelsAndButtons();

    // UGHHHHHHH
    // catTextures = loadSpriteSheet();
    // createCat(0,0,25,25);
    

    // Load Sounds
    // shootSound = new Howl({
    //     src: ['sounds/shoot.wav']
    // });

    // // #7 - Load sprite sheet
    // explosionTextures = loadSpriteSheet();

    // // #8 - Start update loop
    app.ticker.add(gameLoop);

    // // #9 - Start listening for click events on the canvas
    // app.view.onclick = fireBullet;

    // Now our `startScene` is visible
    // Clicking the button calls startGame()
}


function createLabelsAndButtons() {
    // let buttonstyle = new PIXI.TextStyle({
    //     fill: 0xFF0000,
    //     fontSize: 48,
    //     fontFamily: "Futura"
    // });

    // // set up start scene
    // let startLabel1 = new PIXI.Text("Circle Blast!");
    // startLabel1.style = new PIXI.TextStyle({
    //     fill: 0xFFFFFF,
    //     fontSize: 96,
    //     fontFamily: "Futura",
    //     stroke: 0xFF0000,
    //     strokeThickness: 6
    // });
    // startLabel1.x = 50;
    // startLabel1.y = 120;
    // startScene.addChild(startLabel1);

    // // create middle label
    // let startLabel2 = new PIXI.Text("R U Worthy...?");
    // startLabel2.style = new PIXI.TextStyle({
    //     fill: 0xFFFFFF,
    //     fontSize: 32,
    //     fontFamily: "Futura",
    //     fontStyle: "italic",
    //     stroke: 0xFF0000,
    //     strokeThickness: 6
    // });
    // startLabel2.x = 185;
    // startLabel2.y = 300;
    // startScene.addChild(startLabel2);

    // // make start game button
    // let startButton = new PIXI.Text("Enter...if you dare!");
    // startButton.style = buttonstyle;
    // startButton.x = 80;
    // startButton.y = sceneHeight - 100;
    // startButton.interactive = true;
    // startButton.buttonMode = true;
    // startButton.on("pointerup", startGame);
    // startButton.on('pointerover', e => e.target.alpha = 0.7);
    // startButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
    // startScene.addChild(startButton);

    
    // set up gameScene
    let textStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 18,
        fontFamily: "Futura",
        stroke: 0xFF0000,
        strokeThickness: 4
    });

    // make score label
    scoreLabel = new PIXI.Text();
    scoreLabel.style = textStyle;
    scoreLabel.x = 5;
    scoreLabel.y = 5;
    gameScene.addChild(scoreLabel);
    increaseScoreBy(0);

    // make life label
    lifeLabel = new PIXI.Text();
    lifeLabel.style = textStyle;
    lifeLabel.x = 5;
    lifeLabel.y = 26;
    gameScene.addChild(lifeLabel);
    decreaseLifeBy(0);
    startGame();
    // // 3 - set up `gameOverScene`
    // // 3A - make game over text
    // let gameOverText = new PIXI.Text("Game Over!\n        :-O");
    // textStyle = new PIXI.TextStyle({
    //     fill: 0xFFFFFF,
    //     fontSize: 64,
    //     fontFamily: "Futura",
    //     stroke: 0xFF0000,
    //     strokeThickness: 6
    // });
    // gameOverText.style = textStyle;
    // gameOverText.x = 100;
    // gameOverText.y = sceneHeight / 2 - 160;
    // gameOverScene.addChild(gameOverText);

    // // display score
    // gameOverScoreLabel = new PIXI.Text("Your final score: " + score);
    // let goStyle = new PIXI.TextStyle({
    //     fill: 0xFFFFFF,
    //     fontSize: 34,
    //     fontFamily: "Futura",
    //     stroke: 0xFF0000,
    //     strokeThickness: 3
    // });
    // gameOverScoreLabel.style = goStyle;
    // gameOverScoreLabel.x = 150;
    // gameOverScoreLabel.y = gameOverText.y + 250;
    // gameOverScene.addChild(gameOverScoreLabel);


    // // 3B - make "play again?" button
    // let playAgainButton = new PIXI.Text("Play Again?");
    // playAgainButton.style = buttonstyle;
    // playAgainButton.x = 150;
    // playAgainButton.y = sceneHeight - 100;
    // playAgainButton.interactive = true;
    // playAgainButton.buttonMode = true;
    // playAgainButton.on("pointerup", startGame); // startGame is a function reference
    // playAgainButton.on('pointerover', e => e.target.alpha = 0.7); // concise arrow function with no brackets
    // playAgainButton.on('pointerout', e => e.currentTarget.alpha = 1.0); // ditto
    // gameOverScene.addChild(playAgainButton);

}

function startGame() {
    startScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = true;
    levelNum = 1;
    score = 0;
    lives = 100;
    increaseScoreBy(0);
    decreaseLifeBy(0);
    player.x = 450;
    player.y = 230;
    loadLevel();

    
}

function loadLevel() {
    //createCircles(levelNum * 5);
    paused = false;
}


function increaseScoreBy(value) {
    score += value;
    scoreLabel.text = "Score  " + score;
}

function decreaseLifeBy(value) {
    lives -= value;
    lives = parseInt(lives);
    lifeLabel.text = "Life    " + lives + "%";
}

function gameLoop(){
    if (paused) return; 

    

    // Player Movement
    //let mousePosition = app.renderer.plugins.interaction.mouse.global;
    
    window.addEventListener("keydown", keysDown);
    window.addEventListener("keydown", JumpUp);

    // keep player on screen
    
    player.y +=5;
    let w2 = player.width / 2;
    let h2 = player.height / 2;
    if (player.y > 285){
        player.x = clamp(player.x, 220, sceneWidth - w2);
    }
    else{
        player.x = clamp(player.x, 0 + w2, sceneWidth - w2);
    }
    
    if (player.x < 290){
        player.y = clamp(player.y, 0 + h2, 280);
    }
    else{
        player.y = clamp(player.y, 0 + h2, 430);
    }

    // if (isJumping){
    //     player.y -= 5;
    //     jumpCount += 1;
    // }
    // if (jumpCount > 20){
    //     jumpCount = 0;
    //     isJumping = false
    // }
   
}

function keysDown(e){
    if(e.keyCode == 37) {
        console.log("Left was pressed");
        player.x -= 10;
    }
    else if(e.keyCode == 39) {
        console.log("Right was pressed");
        player.x += 10;
    }
}

function JumpUp(e){
    if (e.keyCode == 38) {
        console.log("Up was pressed");
        //isJumping = true
        player.y -= 20;
        // Calculate "delta time"
        // let dt = 1 / app.ticker.FPS;
        // if (dt > 1 / 12) { dt = 1 / 12 };
        // let futureTime = dt+10;
        
        // while (dt< futureTime){
            
        // }
    }
}

// function loadSpriteSheet(){
//     let spriteSheet = PIXI.BaseTexture.from("../images/Cat-2/Cat-2-Walk.png");
//     let width = 50;
//     let height = 50;
//     console.log(height);
//     let numFrames = 8;
//     let textures = [];
//     for (let i=0; i<numFrames; i++){
//         let frame = new PIXI.Texture(spriteSheet, new PIXI.Rectangle(i*width, 50, width, height));
//         textures.push(frame);
//     }
//     return textures;
// }

// function createCat(x, y, frameWidth, frameHeight){
//     let w2 = frameWidth/2;
//     let h2 = frameHeight/2;
//     let catAnim = new PIXI.AnimatedSprite(catTextures);
//     catAnim.x = x- w2;
//     catAnim.y = y - h2;
//     catAnim.animatedSpeed = 1/7;
//     catAnim.loop = true;
//     //catAnim.onComplete = e => gameScene.removeChild(catAnim);
//     cats.push(catAnim);
//     gameScene.addChild(catAnim);
//     catAnim.play();
// }