// LittleJS Arcade — engine loader.
//
// Games and templates include THIS instead of a direct <script src="../dist/littlejs.js">.
// It synchronously document.writes the engine tag — parser-blocking and same-origin, so the
// engine is fully defined before the template helpers and inline game code that follow — then
// applies the canvas settings every game shares in a second tag that runs right after it
// (those globals exist only once the engine tag has executed).
'use strict';
document.write('<script src="../dist/littlejs.js?1780292569262"><\/script>'); // bump query on engine update
document.write(`<script>
    showEngineVersion = false;      // suppress the engine startup message
    canvasMinAspect = .4;
    canvasMaxAspect = 2.5;
    canvasMaxSize = vec2(2048);     // full canvas resolution for sharper rendering on high-DPI displays
    setCanvasPixelRatio();          // use device pixel ratio by default for sharper rendering
<\/script>`);
