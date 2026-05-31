/*
    LittleJS Pong
    - Classic two-paddle Pong, pure shapes (no textures)
    - Left paddle: mouse, or W/S / Up/Down. Right paddle: simple AI.
    - First feel for the folder-per-game + global API workflow.
*/

'use strict';

// engine settings
gravity = vec2(0, 0);
cameraPos = vec2(0, 0);
cameraScale = 32;
debugWatermark = false;

///////////////////////////////////////////////////////////////////////////////
// tuning

const paddleSize     = vec2(0.7, 4);    // width, height in world units
const ballSize       = vec2(0.7, 0.7);
const paddleSpeed    = 0.4;             // world units per frame (keyboard)
const aiSpeed        = 0.3;             // right paddle max speed (kept beatable)
const ballStartSpeed = 0.3;
const maxBallSpeed   = 0.75;
const ballSpeedup    = 1.05;            // ball gets faster on each paddle hit
const englishFactor  = 0.05;            // how much paddle offset curves the ball
const winScore       = 11;

///////////////////////////////////////////////////////////////////////////////
// state (recomputed field bounds live in gameUpdate so resizing just works)

let leftY, rightY;          // paddle center y positions
let ball, ballVel;          // ball position / velocity (vec2)
let leftScore, rightScore;
let half, leftX, rightX, limitY;

///////////////////////////////////////////////////////////////////////////////
function resetBall(dir)
{
    // serve from center toward the given side (dir = -1 left, +1 right)
    ball = vec2(0, 0);
    ballVel = vec2(dir, rand(-0.6, 0.6)).normalize(ballStartSpeed);
}

///////////////////////////////////////////////////////////////////////////////
function gameInit()
{
    leftY = rightY = 0;
    leftScore = rightScore = 0;
    resetBall(rand() < 0.5 ? -1 : 1);
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate()
{
    // field bounds from the current view
    half = getCameraSize().scale(0.5);
    limitY = half.y - paddleSize.y / 2;
    leftX = -half.x + 1.5;
    rightX = half.x - 1.5;

    // left paddle: keyboard if pressed, otherwise follow the mouse
    const kb = keyDirection().y;
    if (kb)
        leftY = clamp(leftY + kb * paddleSpeed, -limitY, limitY);
    else
        leftY = clamp(mousePos.y, -limitY, limitY);

    // right paddle: chase the ball at a capped speed
    rightY = clamp(rightY + clamp(ball.y - rightY, -aiSpeed, aiSpeed), -limitY, limitY);

    // move the ball
    ball = ball.add(ballVel);

    // bounce off top and bottom walls
    const ballR = ballSize.y / 2;
    if (ball.y > half.y - ballR) { ball.y = half.y - ballR; ballVel.y = -Math.abs(ballVel.y); }
    if (ball.y < -half.y + ballR) { ball.y = -half.y + ballR; ballVel.y = Math.abs(ballVel.y); }

    // paddle collisions (only when moving toward that paddle)
    if (ballVel.x < 0 && isOverlapping(ball, ballSize, vec2(leftX, leftY), paddleSize))
        bounceOffPaddle(leftX + (paddleSize.x + ballSize.x) / 2, leftY, 1);
    if (ballVel.x > 0 && isOverlapping(ball, ballSize, vec2(rightX, rightY), paddleSize))
        bounceOffPaddle(rightX - (paddleSize.x + ballSize.x) / 2, rightY, -1);

    // scoring: ball leaves the field past a paddle
    if (ball.x < -half.x) { ++rightScore; resetBall(1); }
    else if (ball.x > half.x) { ++leftScore; resetBall(-1); }
}

///////////////////////////////////////////////////////////////////////////////
function bounceOffPaddle(ballX, paddleY, dir)
{
    ball.x = ballX;                                  // push the ball off the paddle face
    ballVel.x = dir * Math.abs(ballVel.x);           // reflect horizontally
    ballVel.y += (ball.y - paddleY) * englishFactor; // add spin based on hit offset
    ballVel = ballVel.scale(ballSpeedup);
    if (ballVel.length() > maxBallSpeed)
        ballVel = ballVel.normalize(maxBallSpeed);
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost()
{
    // setup camera and prepare for render
}

///////////////////////////////////////////////////////////////////////////////
function gameRender()
{
    // dashed center net
    for (let y = -half.y; y < half.y; y += 2)
        drawRect(vec2(0, y), vec2(0.2, 1.1), hsl(0, 0, 1, 0.4));

    // paddles and ball
    drawRect(vec2(leftX, leftY), paddleSize, WHITE);
    drawRect(vec2(rightX, rightY), paddleSize, WHITE);
    drawRect(ball, ballSize, WHITE);
}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost()
{
    // scores
    const cx = mainCanvasSize.x / 2;
    drawTextScreen(leftScore, vec2(cx - 120, 70), 70, WHITE);
    drawTextScreen(rightScore, vec2(cx + 120, 70), 70, WHITE);

    // win banner
    if (leftScore >= winScore || rightScore >= winScore)
    {
        const who = leftScore > rightScore ? 'Left' : 'Right';
        drawTextScreen(`${who} player wins!`, vec2(cx, mainCanvasSize.y / 2), 50, WHITE);
    }
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);
