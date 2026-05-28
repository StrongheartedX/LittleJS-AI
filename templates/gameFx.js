'use strict';

// AI can use this class to make sound effects
class SoundGenerator extends Sound
{
    constructor(params = {})
    {
        const {
            volume = 1,        // Volume scale (percent)
            randomness = .05,  // How much to randomize frequency (percent Hz)
            frequency = 220,   // Frequency of sound (Hz)
            attack = 0,        // Attack time, how fast sound starts (seconds)
            release = .1,      // Release time, how fast sound fades out (seconds)
            shapeCurve = 1,    // Squarenes of wave (0=square, 1=normal, 2=pointy)
            slide = 0,         // How much to slide frequency (kHz/s)
            pitchJump = 0,     // Frequency of pitch jump (Hz)
            pitchJumpTime = 0, // Time of pitch jump (seconds)
            repeatTime = 0,    // Resets some parameters periodically (seconds)
            noise = 0,         // How much random noise to add (percent)
            bitCrush = 0,      // Resamples at a lower frequency in (samples*100)
            delay = 0,         // Overlap sound with itself for reverb and flanger effects (seconds)
        } = params;

        super([volume, randomness, frequency, attack, 0, release, 0, shapeCurve, slide, 0,
            pitchJump, pitchJumpTime, repeatTime, noise, 0, bitCrush, delay, 1, 0, 0, 0]);
    }
}

// ============================================================================
// Screen shake — random-walk nudge on cameraPos, decays linearly to zero.
// Stacks by keeping whichever active shake has the larger (amount × remaining)
// "energy" — strongest event wins, weaker is discarded.
//
// Registered as a single engine plugin at file-scope. Future game-feel
// helpers (hit-stop, flashes, etc.) can slot into gameFxUpdate / gameFxRender
// below without games needing additional engineAddPlugin calls.
// ============================================================================

let _shakeAmount    = 0;     // peak amplitude in world units
let _shakeRemaining = 0;     // seconds left
let _shakeDuration  = 1;     // original duration of the active event
let _shakeEnabled   = true;

function addScreenShake(amount, duration)
{
    if (!(amount > 0) || !(duration > 0)) return;
    const newEnergy = amount * duration;
    const curEnergy = _shakeAmount * _shakeRemaining;
    if (newEnergy <= curEnergy) return;
    _shakeAmount    = amount;
    _shakeRemaining = duration;
    _shakeDuration  = duration;
}

function setScreenShakeEnabled(b) { _shakeEnabled = !!b; }
function isScreenShakeEnabled()   { return _shakeEnabled; }

function _shakeUpdate()
{
    if (_shakeRemaining <= 0) return;
    _shakeRemaining -= timeDelta;
    if (_shakeRemaining <= 0)
    {
        _shakeAmount = 0;
        return;
    }
    if (!_shakeEnabled) return;
    const a = _shakeAmount * (_shakeRemaining / _shakeDuration);
    cameraPos = cameraPos.add(vec2(rand(-a, a), rand(-a, a)));
}

function gameFxUpdate()
{
    _shakeUpdate();
    // future feel-helpers slot in here
}

function gameFxRender()
{
    // reserved for future render-phase effects
}

engineAddPlugin(gameFxUpdate, gameFxRender);
