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
        "../images/star.png",
        "../images/cloud.png",
        "../images/jumpBG.png",
        "../images/sample.png",
        "../images/sampleCatch.png",
        "../images/sampleScore.png"
    ]);
app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
app.loader.onComplete.add(setup);
app.loader.load();

// aliases
let stage;

// game variables
let startScene;
let instructScene;
let gameScene, layerOne, layerTwo, layerThree, 
    layerFour, player, star, scoreLabel, lifeLabel, 
    jumpSound, collectSound;
let gameOverScene;
let startSceneBG;
let instructSceneBG;
let endSceneBG;

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
    startScene.visible = true;
    stage.addChild(startScene);

    // create instructions scene
    instructScene = new PIXI.Container();
    instructScene.visible = false;
    stage.addChild(instructScene);

    // Create game scene
    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);

    // create game over scene
    gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);

    
    
    // create backgrounds

    // game scene bg
    layerOne = new FirstLayer();
    gameScene.addChild(layerOne);
    layerTwo = new SecondLayer();
    gameScene.addChild(layerTwo);
    layerThree = new ThirdLayer();
    gameScene.addChild(layerThree);
    layerFour = new SceneLayer();
    gameScene.addChild(layerFour);

    // game over scene bg
    startSceneBG = new FirstLayer();
    startSceneBG.scale.set(5.5);
    startScene.addChild(startSceneBG);

    instructSceneBG = new FirstLayer();
    instructSceneBG.scale.set(5.5);
    instructScene.addChild(instructSceneBG);

    endSceneBG = new FirstLayer();
    endSceneBG.scale.set(5.5);
    gameOverScene.addChild(endSceneBG);
    
    // Create player
    player = new Player();
    gameScene.addChild(player);

    // #6 - Load Sounds
    collectSound = new Howl({
        src: ['../sfx/catchStar.wav']
    });

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
    
    // set up start scene
    let bgStar = new Star(432, 200);
    bgStar.scale.set(1.5);
    startScene.addChild(bgStar);
    
    let startLabel1 = new PIXI.Text("STAR CATCHER!");
    startLabel1.style = new PIXI.TextStyle({
        fill: 0xf0b160,
        fontSize: 83,
        fontFamily: "Berkshire Swash, serif",
        stroke: 0x6e4e85,
        strokeThickness: 10
    });
    startLabel1.x = (sceneWidth/2)- (startLabel1.width/2);
    startLabel1.y = 120;
    startScene.addChild(startLabel1);

    // make start game button
    let startButton = new PIXI.Text("Start Catching");
    let startButtonStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 30,
        fontFamily: "Arial",
        stroke: 0x8cb6fa,
        strokeThickness: 2
    });
    startButton.style = startButtonStyle;
    startButton.x = (sceneWidth/2)- (startButton.width/2);
    startButton.y = sceneHeight - 160;
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on("pointerup", startGame);
    startButton.on('pointerover', e => e.target.alpha = 0.7);
    startButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
    startScene.addChild(startButton);

    // make instructions button
    let instructButton = new PIXI.Text("Instructions");
    instructButton.style = startButtonStyle;
    instructButton.x = (sceneWidth/2)- (instructButton.width/2);
    instructButton.y = startButton.y + 50;
    instructButton.interactive = true;
    instructButton.buttonMode = true;
    instructButton.on("pointerup", instruct);
    instructButton.on('pointerover', e => e.target.alpha = 0.7);
    instructButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
    startScene.addChild(instructButton);

    // set up instructions scene
    let sampleImg = new Sample();
    instructScene.addChild(sampleImg);

    // make start game button
    let backButton = new PIXI.Text("<-- Back");
    let backButtonStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 30,
        fontFamily: "Arial",
        stroke: 0x8cb6fa,
        strokeThickness: 2
    });
    backButton.style = backButtonStyle;
    backButton.x = (sceneWidth/2)- (startButton.width/2);
    backButton.y = sceneHeight - 100;
    backButton.interactive = true;
    backButton.buttonMode = true;
    backButton.on("pointerup", returnHome);
    backButton.on('pointerover', e => e.target.alpha = 0.7);
    backButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
    instructScene.addChild(backButton);

    // add instructions
    let instructPara = new PIXI.Text("Help the cat catch all the stars!\nThe more you catch the higher\nyour score! The more you drop \nthe lower your life points until\nGame Over.");
    let instructParaStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 20,
        fontFamily: "Arial"
        // stroke: 0x8cb6fa,
        // strokeThickness: 2
    });
    instructPara.style = instructParaStyle;
    instructPara.x = 525;
    instructPara.y = 170;
    instructScene.addChild(instructPara);
    
    // set up gameScene
    let textStyle = new PIXI.TextStyle({
        fill: 0xf0b160,
        fontSize: 22,
        fontFamily: "Berkshire Swash, serif",
        stroke: 0x6e4e85,
        strokeThickness: 4
    });

    // make score label
    scoreLabel = new PIXI.Text();
    scoreLabel.style = textStyle;
    scoreLabel.x = 5;
    scoreLabel.y = 5;
    gameScene.addChild(scoreLabel);
    increaseScore(0);

    // make life label
    lifeLabel = new PIXI.Text();
    lifeLabel.style = textStyle;
    lifeLabel.x = 5;
    lifeLabel.y = 37;
    gameScene.addChild(lifeLabel);
    decreaseLives(0);
    //startGame();


    // set up gameOverScene

    let bgCloud = new Cloud(432, 200);
    gameOverScene.addChild(bgCloud);
    // let statBox = new Box(0xc4c4c4);
    // gameOverScene.addChild(statBox);

    let gameOverText = new PIXI.Text("Game Over!");
    textStyle = new PIXI.TextStyle({
        fill: 0xf0b160,
        fontSize: 120,
        //fontfamily: "'Twinkle Star', cursive"
        fontFamily: "Berkshire Swash, serif",
        stroke: 0x6e4e85,
        strokeThickness: 12
    });
    gameOverText.style = textStyle;
    gameOverText.x =  (sceneWidth/2)- (gameOverText.width/2);
    gameOverText.y = sceneHeight / 2 - 160;
    gameOverScene.addChild(gameOverText);

    // display score
    gameOverScoreLabel = new PIXI.Text("Score: " + score);
    let gameOverStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 30,
        fontFamily: "Arial",
        stroke: 0x8cb6fa,
        strokeThickness: 3
    });
    gameOverScoreLabel.style = gameOverStyle;
    gameOverScoreLabel.x = (sceneWidth/2)- (gameOverScoreLabel.width/2);
    gameOverScoreLabel.y = gameOverText.y + 170;
    gameOverScene.addChild(gameOverScoreLabel);


    // replay button
    let playAgainButton = new PIXI.Text("Replay?");
    playAgainButton.style = gameOverStyle;
    playAgainButton.x = (sceneWidth/2)- (playAgainButton.width/2);
    playAgainButton.y = gameOverScoreLabel.y + 50;
    playAgainButton.interactive = true;
    playAgainButton.buttonMode = true;
    playAgainButton.on("pointerup", startGame); // startGame is a function reference
    playAgainButton.on('pointerover', e => e.target.alpha = 0.7); // concise arrow function with no brackets
    playAgainButton.on('pointerout', e => e.currentTarget.alpha = 1.0); // ditto
    gameOverScene.addChild(playAgainButton);

    // go home button
    let homeButton = new PIXI.Text("Home");
    homeButton.style = gameOverStyle;
    homeButton.x = (sceneWidth/2)- (homeButton.width/2);
    homeButton.y = playAgainButton.y + 50;
    homeButton.interactive = true;
    homeButton.buttonMode = true;
    homeButton.on("pointerup", returnHome); // startGame is a function reference
    homeButton.on('pointerover', e => e.target.alpha = 0.7); // concise arrow function with no brackets
    homeButton.on('pointerout', e => e.currentTarget.alpha = 1.0); // ditto
    gameOverScene.addChild(homeButton);

}

function startGame() {
    startScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = true;
    levelNum = 1;
    score = 0;
    lives = 100;
    increaseScore(0);
    decreaseLives(0);
    player.x = 450;
    player.y = 230;
    loadLevel();

}

function returnHome(){
    startScene.visible = true;
    instructScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = false;
}

function instruct(){
    startScene.visible = false;
    instructScene.visible = true;
    gameOverScene.visible = false;
    gameScene.visible = false;

}

function increaseScore(value) {
    score += value;
    scoreLabel.text = "Score  " + score;
}

function decreaseLives(value) {
    lives -= value;
    lives = parseInt(lives);
    lifeLabel.text = "Life    " + lives;
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
    player.x = clamp(player.x, 0 + w2, sceneWidth - w2);
    player.y = clamp(player.y, 0 + h2, 430);
    // if (player.y > 285){
    //     player.x = clamp(player.x, 220, sceneWidth - w2);
    // }
    // else{
    //     player.x = clamp(player.x, 0 + w2, sceneWidth - w2);
    // }
    
    // if (player.x < 290){
    //     player.y = clamp(player.y, 0 + h2, 280);
    // }
    // else{
    //     player.y = clamp(player.y, 0 + h2, 430);
    // }

    // if (isJumping){
    //     player.y -= 5;
    //     jumpCount += 1;
    // }
    // if (jumpCount > 20){
    //     jumpCount = 0;
    //     isJumping = false
    // }

    // Make the stars fall
    for (let s of stars) {
        s.y += 2;
    }

    // Check Collisions
    for (let s of stars) {

        // player and stars
        if (s.isAlive && rectsIntersect(s, player)) {
            collectSound.play();
            gameScene.removeChild(s);
            s.isAlive = false;
            increaseScore(10);
        }
    }

    // Check for dropped stars
    for (let s of stars) {
        if (s.y > 450-s.height){
            gameScene.removeChild(s);
            s.isAlive = false;
            decreaseLives(5);
        }
    }

    // get rid of removed stars
    stars = stars.filter(s => s.isAlive);

    // que game over
    if (lives <= 0) {
        end();
        return; // return here so we skip #8 below
    }

    //Load next level
    if (stars.length == 0) {
        if (levelNum < 5){
            levelNum++;
        }
        loadLevel();
    }

}

function keysDown(e){
    if(e.keyCode == 37) {
        console.log("Left was pressed");
        player.x -= 15;
    }
    else if(e.keyCode == 39) {
        console.log("Right was pressed");
        player.x += 15;
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

function createStars(numStars) {
    for (let i = 0; i < numStars; i++) {
        let s = new Star();
        s.x = Math.random() * (sceneWidth - 50) + 25;
        s.y = Math.random() * (0 - -500) - 500;
        stars.push(s);
        gameScene.addChild(s);
    }
}

function loadLevel() {
    createStars(levelNum * 2);
    paused = false;
}

function end() {
    paused = true;
    // clear level
    stars.forEach(s => gameScene.removeChild(s));
    stars = [];

    // bullets.forEach(b => gameScene.removeChild(b))
    // bullets = [];

    // explosions.forEach(e => gameScene.removeChild(e));
    // explosions = [];

    gameOverScoreLabel.text = "Score " + score;

    gameOverScene.visible = true;
    gameScene.visible = false;
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