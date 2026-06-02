let BACKGROUND_SCROLL_SPEED = .5
let BACKGROUND_LOOPING_PT = 413
let GROUND_SCROLL_SPEED = 1
let GROUND_LOOPING_PT = 438
let SPACE = 32

let bgScroll = 0
let groundScroll = 0
let spawnTimer = 0
let points = 0
let pipes = []
let gameState = "title" // title, countdown, play, done
let count = 3
let timer = 0
let oldHighScore = 0
let newHighScore = 0
let goal = false

let bgImage, groundImage, birdImage, bird, pipeImage, pipe, lastY
let flappyFont, gameFont, explosion, jump, score, hurt, music

function preload() {
    bgImage = loadImage('graphics/background.png')
    groundImage = loadImage('graphics/ground.png')
    birdImage = loadImage('graphics/bird.png')
    pipeImage = loadImage('graphics/pipe.png')

    flappyFont = loadFont('fonts/flappy.ttf')
    gameFont = loadFont('fonts/font.ttf')

    jump = loadSound('sounds/jump.wav')
    score = loadSound('sounds/score.wav')
    explosion = loadSound('sounds/explosion.wav')
    hurt = loadSound('sounds/hurt.wav')
    music = loadSound('sounds/marios_way.mp3')
}

function setup() {
    createCanvas(800, 500)
    bird = new Bird(birdImage, width / (2 * 1.74) - birdImage.width / 2, height / (2 * 1.74) - birdImage.height / 2)
    pipe = new Pipe(pipeImage)
    lastY = random(150, 200)
    music.loop()
}

function title() {
    fill(255)
    textSize(28)
    textAlign(CENTER)
    textFont(flappyFont)
    text("Fifty Bird", width / (2 * 1.74), 100)
    textSize(14)
    text("Press enter to start", width / (2 * 1.74), 130)
}

function draw() {
    scale(1.74)
    noSmooth()

    image(bgImage, -bgScroll, 0)
    bgScroll = (bgScroll + BACKGROUND_SCROLL_SPEED) % BACKGROUND_LOOPING_PT

    image(groundImage, -groundScroll, height / 1.74 - 16)
    groundScroll = (groundScroll + GROUND_SCROLL_SPEED) % GROUND_LOOPING_PT

    if (gameState == "title") {
        title()
    }
    else if (gameState == "countdown") {
        countdown()
    }
    else if (gameState == "play") {
        play()
    }
    else if (gameState == "done") {
        done()
    }
}

function done() {
    fill(255)
    textSize(28)
    textAlign(CENTER)
    textFont(flappyFont)

    if (points >= 100) {
        text("Well Done!", width / (2 * 1.74), 90)
        goal = true
    }
    else if (points < 100) {
        text("Oops! You lost!", width / (2 * 1.74), 90)
    }
    textSize(14)
    text("Score: " + points, width / (2 * 1.74), 130)

    if (points > oldHighScore) {
        newHighScore = points
        text("High Score: " + newHighScore, width / (2 * 1.74), 160)
    }
    else {
        text("High Score: " + oldHighScore, width / (2 * 1.74), 160)
    }

    if (goal == false) {
        text("Goal: 100", width / (2 * 1.74), 190)
    }

    textSize(21)
    text("Press enter to play again", width / (2 * 1.74), 220)
}

function countdown() {
    fill(255)
    textSize(56)
    textAlign(CENTER, CENTER)
    textFont(flappyFont)
    text(count, width / (2 * 1.74), height / (2 * 1.74))

    if (frameCount % 60 == 0) {
        count--
    }

    if (count == 0) {
        pipes = []
        count = 3
        gameState = "play"
    }
}

function displayPoint() {
    fill(255)
    textSize(50)
    textFont(flappyFont)
    textAlign(CENTER)
    text(points, 230, 40)
}

function play() {
    bird.display()
    bird.update()

    spawnTimer += 1/60

    if (spawnTimer > 2) {
        pipe = new Pipe(pipeImage)
        pipe.y = constrain(lastY + random(-50, 50), 100, 220)
        lastY = pipe.y
        pipes.push(pipe)
        spawnTimer = 0
    }

    for (let pipe of pipes) {
        pipe.display()
        pipe.update()

        if (bird.collides(pipe)) {
            explosion.play()
            hurt.play()
            gameState = "done"
        }

        if (!pipe.scored) {
            if (pipe.x + pipe.width / 2 < bird.x) {
                points++
                score.play()
                pipe.scored = true
            }
        }

        if (pipe.x + pipe.width < 0)
        {
            pipes.shift()
        }

    }

    displayPoint()
}
function keyPressed() {
    if (gameState == "play" && keyCode == SPACE) {
        bird.jump()
        jump.play()
    }

    if (keyCode == ENTER || keyCode == RETURN) {
        if (gameState == "title" || gameState == "done") {
            bird.reset(height / (2 * 1.74) - bird.height / 2)
            points = 0
            oldHighScore = newHighScore
            gameState = "countdown"
        }
    }
}
