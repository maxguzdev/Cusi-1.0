/************************
***** DECLARATIONS: *****
************************/
let cvs         //  canvas
let ctx         //  context'2d'
let description //  game description
let theme1      //  sprite sheet (img/og-theme.png)
let bg          //  background
let bird        //  bird
let pipes       //  top and bottom pipes
let ground      //  ground floor
let getReady    //  tutorial (tap) sign
let gameOver    //  game over trigger (panel is HTML)
let score       //  score counter
let gameState   //  state of game
let frame       //  ms/frame = 17; dx/frame = 2; fps = 59;
let degree      //  bird rotation degree
let paused = false  //  game paused by the player
const SFX_SCORE = new Audio()         //  sound for scoring
const SFX_FLAP = new Audio()          //  sound for flying bird
const SFX_COLLISION = new Audio()     //  sound for collision
const SFX_FALL = new Audio()          //  sound for falling to the ground
const SFX_SWOOSH = new Audio()        //  sound for changing game state

cvs = document.getElementById('game')
ctx = cvs.getContext('2d')
description = document.getElementById('description')
theme1 = new Image()
theme1.src = 'img/og-theme.png'
frame = 0;
degree = Math.PI/180
SFX_SCORE.src = 'audio/sfx_point.wav'
SFX_FLAP.src = 'audio/sfx_wing.wav'
SFX_COLLISION.src = 'audio/sfx_hit.wav'
SFX_FALL.src = 'audio/sfx_die.wav'
SFX_SWOOSH.src = 'audio/sfx_swooshing.wav'

const SKY_COLOR = '#d5f0e4'   //  the sky is transparent in the sprite sheet

gameState = {
    //loads game on ready screen, tick to change state of game
    current: 0,
    getReady: 0,
    //on play game state: bird flaps and flies
    play: 1,
    //game over screen: button||click takes player to ready screen
    gameOver: 2
}
//background  (sheet: x0 y0 276x228)
bg = {
    imgX: 0,
    imgY: 0,
    width: 276,
    height: 228,
    //x,y coordinates of where image should be drawn on canvas
    x: 0,
    y: cvs.height - 228,
    w: 276,
    h: 228,
    dx: .2,
    render: function() {
        //image repeats 3 times for continuous animation
        for (let i = 0; i < 3; i++) {
            ctx.drawImage(theme1, this.imgX,this.imgY,this.width,this.height, this.x + this.width*i,this.y,this.w,this.h)
        }
    },

    position: function () {
        //still img on get ready frame
        if (gameState.current == gameState.getReady) {
            this.x = 0
        }
        //ANIMATION: slowly move background on play game state by decrementing x
        if (gameState.current == gameState.play) {
            this.x = (this.x-this.dx) % (this.w)
        }
    }
}
//top and bottom pipes  (sheet: two 52x400 sprites)
pipes = {
    //pipe with the cap on top (goes on the bottom of the screen)
    bot: {
        imgX: 502,
        imgY: 0,
    },
    //pipe with the cap on the bottom (hangs from the top of the screen)
    top: {
        imgX: 554,
        imgY: 0,
    },
    width: 52,
    height: 400,
    //pipes' values for drawing on canvas (1:1, no stretching)
    w: 52,
    h: 400,
    gap: 85,
    dx: 2,
    //acceptable y values must be -360 <= y <= -140
    //(bottom end of the top pipe lands between 40 and 260)
    minY: -360,
    maxY: -140,

    pipeGenerator: [],

    reset: function() {
        this.pipeGenerator = []
    },
    render: function() {
        for (let i = 0; i < this.pipeGenerator.length; i++) {
            let pipe = this.pipeGenerator[i]
            let topPipe = pipe.y
            let bottomPipe = pipe.y + this.gap + this.h

            ctx.drawImage(theme1, this.top.imgX,this.top.imgY,this.width,this.height, pipe.x,topPipe,this.w,this.h)
            ctx.drawImage(theme1, this.bot.imgX,this.bot.imgY,this.width,this.height, pipe.x,bottomPipe,this.w,this.h)
        }
    },
    position: function() {
        //if game is not in session, do nothing
        if (gameState.current !== gameState.play) {
            return
        }
        //when pipes reach this frame, generate another set
        if (frame%100 == 0) {
            this.pipeGenerator.push(
                {
                    //spawn off canvas
                    x: cvs.width,
                    //random y-coordinates within acceptable parameters
                    y: Math.floor((Math.random() * (this.maxY-this.minY+1)) + this.minY)
                }
            )
        }
        //iterate for all pipes generated (animation, collision, deletion)
        for (let i = 0; i < this.pipeGenerator.length; i++) {

            //decleration for bird and pipes' parameters (COLLISION)
            let pg = this.pipeGenerator[i]
            let b = {
                left: bird.x - bird.r,
                right: bird.x + bird.r,
                top: bird.y - bird.r,
                bottom: bird.y + bird.r,
            }
            let p = {
                top: {
                    top: pg.y,
                    bottom: pg.y + this.h
                },
                bot: {
                    top: pg.y + this.h + this.gap,
                    bottom: pg.y + this.h*2 + this.gap
                },
                left: pg.x,
                right: pg.x + this.w
            }

            //ANIMATION: set of pipes scroll from the right of canvas by decrementing x
            pg.x -= this.dx

            //score up as soon as the bird fully passes a pipe
            if (!pg.passed && pg.x + this.w < bird.x - bird.r) {
                pg.passed = true
                score.current++
                SFX_SCORE.play()
            }
            //delete pipes as they scroll off the canvas (memory management)
            if(pg.x < -this.w) {
                this.pipeGenerator.shift()
            }

            //collision with top pipe
            if (b.left < p.right &&
                b.right > p.left &&
                b.top < p.top.bottom &&
                b.bottom > p.top.top) {
                    gameState.current = gameState.gameOver
                    SFX_COLLISION.play()
            }
            //collision with bottom pipe
            if (b.left < p.right &&
                b.right > p.left &&
                b.top < p.bot.bottom &&
                b.bottom > p.bot.top) {
                    gameState.current = gameState.gameOver
                    SFX_COLLISION.play()
            }
        }
    }
}
//ground floor  (sheet: x276 y0 224x112)
ground = {
    imgX: 276,
    imgY: 0,
    width: 224,
    height: 112,
    //values for drawing on canvas
    x: 0,
    y:cvs.height - 112,
    w:224,
    h:112,
    dx: 2,
    render: function() {
        ctx.drawImage(theme1, this.imgX,this.imgY,this.width,this.height, this.x,this.y,this.w,this.h)
        //image repeat and tile to fit canvas
        ctx.drawImage(theme1, this.imgX,this.imgY,this.width,this.height, this.x + this.width,this.y,this.w,this.h)
    },
    //ANIMATION:  ground scrolls to the left in a continuous loop when game state is at play
    //needs to be at the same rate of pipes' scroll speed
    position: function() {
        if (gameState.current == gameState.getReady) {
            this.x = 0
        }
        if (gameState.current == gameState.play) {
            //modulus keeps this.x value infinitely cycling back to zero
            this.x = (this.x-this.dx) % (this.w/2)
        }
    }
}
//current score  (drawn with the Cusi font, no number sprites)
score = {
    current: 0,
    //values for drawing on canvas
    x: cvs.width/2,
    y: 70,
    reset: function() {
        this.current = 0
    },
    //display the score
    render: function() {
        if (gameState.current == gameState.play ||
            gameState.current == gameState.gameOver) {
            //if current score has thousands place value: the game is over
            if (this.current >= 1000) {
                gameState.current = gameState.gameOver
            }
            ctx.save()
            ctx.font = "44px 'Cusi Regular', 'Trebuchet MS', sans-serif"
            ctx.textAlign = 'center'
            ctx.textBaseline = 'alphabetic'
            ctx.lineJoin = 'round'
            ctx.lineWidth = 8
            ctx.strokeStyle = '#15101f'
            ctx.fillStyle = '#fff6d8'
            ctx.strokeText(this.current, this.x, this.y)
            ctx.fillText(this.current, this.x, this.y)
            ctx.restore()
        }
    }
}
//bird  (sheet: 3 frames stacked at x276, each 56 wide)
bird = {
    animation: [
        {imgX: 276, imgY: 115, height: 48},  //  position 0
        {imgX: 276, imgY: 163, height: 47},  //  position 1
        {imgX: 276, imgY: 210, height: 48},  //  position 2
        {imgX: 276, imgY: 163, height: 47}   //  position 1
    ],
    fr: 0,
    //width of every frame in the sheet
    width: 56,
    //values for drawing on canvas (same proportion as the sprite)
    x: 50,
    y: 160,
    w: 40,
    h: 34,
    //bird's radius
    r: 12,
    //how much the bird flies per flap()
    fly: 5.25,
    //gravity increments the velocity per frame
    gravity: .32,
    //velocity = pixels the bird will drop in a frame
    velocity: 0,
    rotation: 0,
    render: function() {
        let f = this.animation[this.fr]
        //save all previous setting
        ctx.save()
        //target center of bird
        ctx.translate(this.x, this.y)
        //rotate bird by degree
        ctx.rotate(this.rotation)
        //bird is centered on x,y position
        ctx.drawImage(theme1, f.imgX,f.imgY,this.width,f.height, -this.w/2,-this.h/2,this.w,this.h)
        ctx.restore()
    },
    //bird flies
    flap: function() {
        this.velocity = - this.fly
    },
    //function checks gameState and updates bird's position
    position: function() {
        if (gameState.current == gameState.getReady) {
            this.y = 160
            this.rotation = 0 * degree
            //bird animation changes every 20 frames
            if (frame%20 == 0) {
                this.fr += 1
            }
            //when bird animation reaches its last value, reset animation
            if (this.fr > this.animation.length - 1) {
                this.fr = 0
            }

        } else {
            //bird animation changes every 4 frames
            if (frame%4 == 0) {
                this.fr += 1
            }
            //when bird animation reaches its last value, reset animation
            if (this.fr > this.animation.length - 1) {
                this.fr = 0
            }

            //bird falls to gravity
            this.velocity += this.gravity
            this.y += this.velocity

            //bird rotation
            if (this.velocity <= this.fly) {
                this.rotation = -15 * degree
            } else if (this.velocity >= this.fly+2) {
                this.rotation = 70 * degree
                this.fr = 1
            } else {
                this.rotation = 0
            }

            //check collision with ground
            if (this.y+this.h/2 >= cvs.height-ground.h) {
                this.y = cvs.height-ground.h - this.h/2
                //stop flapping when it hits the ground
                this.fr = 1
                this.rotation = 70 * degree
                //then the game is over
                if (gameState.current == gameState.play) {
                    gameState.current = gameState.gameOver
                    SFX_FALL.play()
                }
            }

            //bird cannot fly above canvas
            if (this.y-this.h/2 <= 0) {
                this.y = this.r
            }

        }
    }
}
//tutorial sign: bird + arrow + TAP  (sheet: x27 y280 122x103)
getReady = {
    imgX: 27,
    imgY: 280,
    width: 122,
    height: 103,
    //values for drawing on canvas
    x: cvs.width/2 - 122/2,
    y: 215,
    w: 122,
    h: 103,
    render: function() {
        //only draw this if the game state is on get ready
        if (gameState.current == gameState.getReady) {
            ctx.drawImage(theme1, this.imgX,this.imgY,this.width,this.height, this.x,this.y,this.w,this.h)
        }
    }
}
//game over trigger
gameOver = {
    //the game over panel is HTML now (see CUSI UI LAYER at the end of this file)
    render: function() {
        if (gameState.current == gameState.gameOver) {
            showGameOver()
        }
    }
}
/************************
***** FUNCTIONS: ********
************************/
//anything to be drawn on canvas goes in here
let draw = () => {
    //this clears canvas to default bg color
    ctx.fillStyle = SKY_COLOR
    ctx.fillRect(0,0, cvs.width,cvs.height)
    //things to draw
    bg.render()
    pipes.render()
    ground.render()
    score.render()
    bird.render()
    getReady.render()
    gameOver.render()
}
//updates on animation and position goes in here
let update = () => {
    //things to update
    bird.position()
    bg.position()
    pipes.position()
    ground.position()
}
//game looper
let loop = () => {
    draw()
    if (!paused) {
        update()
        frame++
    }
    //average of requestAnimationFrame is 50-60fps
    // requestAnimationFrame(loop)
}
loop()
setInterval(loop, 17)

/*************************
***** CUSI UI LAYER ******
*************************/
const BEST_KEY = 'cusi_flappy_best'
const MUTE_KEY = 'cusi_flappy_mute'
const MEDALS = [
    { min: 40, name: 'platino' },
    { min: 30, name: 'oro' },
    { min: 20, name: 'plata' },
    { min: 10, name: 'bronce' }
]
const sfxList = [SFX_SCORE, SFX_FLAP, SFX_COLLISION, SFX_FALL, SFX_SWOOSH]
const $ = (id) => document.getElementById(id)
const stage = $('stage')
const panelOver = $('panel-over')
const panelPause = $('panel-pause')
const btnMute = $('btn-mute')
let bestScore = 0
let muted = false
let overShown = false
let overTimer = null
try { bestScore = parseInt(localStorage.getItem(BEST_KEY)) || 0 } catch (e) {}
try { muted = localStorage.getItem(MUTE_KEY) === '1' } catch (e) {}

function renderBest() {
    $('hud-best').textContent = bestScore
}
function setHint(on) {
    description.classList.toggle('oculto', !on)
}
function applyMute() {
    sfxList.forEach((s) => { s.muted = muted })
    btnMute.setAttribute('aria-pressed', muted)
    btnMute.title = muted ? 'Activar sonido (M)' : 'Silenciar (M)'
    try { localStorage.setItem(MUTE_KEY, muted ? '1' : '0') } catch (e) {}
}
function setOverlay(panel, visible) {
    panel.classList.toggle('visible', visible)
    panel.setAttribute('aria-hidden', !visible)
}

//called every frame by gameOver.render(); only reacts the first time
function showGameOver() {
    if (overShown) return
    overShown = true
    paused = false
    stage.classList.add('golpe')
    setTimeout(() => stage.classList.remove('golpe'), 350)

    const finalScore = score.current
    const nuevoRecord = finalScore > bestScore
    if (nuevoRecord) {
        bestScore = finalScore
        try { localStorage.setItem(BEST_KEY, bestScore) } catch (e) {}
        renderBest()
    }
    const medal = MEDALS.find((m) => finalScore >= m.min)
    $('over-score').textContent = finalScore
    $('over-best').textContent = bestScore
    $('over-nuevo').classList.toggle('on', nuevoRecord)
    $('over-medalla').dataset.medalla = medal ? medal.name : 'ninguna'
    $('over-medalla-nombre').textContent = medal ? 'Medalla de ' + medal.name : 'Sin medalla todavía'

    //small delay so the player sees the bird fall before the panel appears
    overTimer = setTimeout(() => {
        setOverlay(panelOver, true)
        $('btn-retry').focus()
    }, 650)
}

function restart() {
    if (gameState.current !== gameState.gameOver || !panelOver.classList.contains('visible')) return
    clearTimeout(overTimer)
    overShown = false
    setOverlay(panelOver, false)
    pipes.reset()
    score.reset()
    bird.velocity = 0
    gameState.current = gameState.getReady
    SFX_SWOOSH.play()
    setHint(true)
    document.activeElement && document.activeElement.blur()
}

function handleInput() {
    if (paused) return
    //ready screen >> play state
    if (gameState.current == gameState.getReady) {
        frame = 0
        gameState.current = gameState.play
    }
    //play state >> bird flies
    if (gameState.current == gameState.play) {
        bird.flap()
        SFX_FLAP.play()
        setHint(false)
    }
}

function setPaused(value) {
    if (value && gameState.current !== gameState.play) return
    paused = value
    setOverlay(panelPause, value)
    if (value) $('btn-resume').focus()
    else document.activeElement && document.activeElement.blur()
}

function toggleFullscreen() {
    if (!document.fullscreenEnabled) return
    if (document.fullscreenElement) {
        document.exitFullscreen()
    } else {
        document.documentElement.requestFullscreen().catch(() => {})
    }
}

/*************************
***** EVENT HANDLERS ***** 
*************************/
//mouse click // tap screen (pointerdown responds faster than click on mobile)
cvs.addEventListener('pointerdown', (e) => {
    e.preventDefault()
    handleInput()
})

document.addEventListener('keydown', (e) => {
    if (e.repeat) return
    switch (e.code) {
        case 'Space':
        case 'ArrowUp':
        case 'KeyW':
            e.preventDefault()
            if (gameState.current == gameState.gameOver) restart()
            else handleInput()
            break
        case 'Enter':
            if (gameState.current == gameState.gameOver) restart()
            break
        case 'Escape':
        case 'KeyP':
            setPaused(!paused)
            break
        case 'KeyM':
            muted = !muted
            applyMute()
            break
        case 'KeyF':
            toggleFullscreen()
            break
    }
})

//pause automatically if the player leaves the tab
document.addEventListener('visibilitychange', () => {
    if (document.hidden) setPaused(true)
})

$('btn-retry').addEventListener('click', restart)
$('btn-resume').addEventListener('click', () => setPaused(false))
btnMute.addEventListener('click', () => { muted = !muted; applyMute() })

renderBest()
applyMute()
setHint(true)