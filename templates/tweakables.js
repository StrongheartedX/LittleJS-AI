'use strict';

// AI can use this module to mark globals as tweakable so they can be
// changed live in an HTML overlay panel. Toggle the panel with Tab.
//
// Usage:
//   tweak('jumpPower');                          // number, no slider
//   tweak('gravity.y', {min: -.05, max: 0});    // slider with range
//   tweak('debugDraw');                          // boolean checkbox
//   tweak('skyColor');                           // Color picker
//   tweak('gravity', {min: -.05, max: .05});    // Vector2 paired
//   tweakEngineDefaults();                       // common engine globals

function tweak(path, options = {})
{
    // implemented in later tasks
}

function tweakEngineDefaults()
{
    // implemented in later tasks
}
