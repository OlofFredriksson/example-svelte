const fs = require("fs");
const svelte = require("svelte/compiler");
const esbuild = require("esbuild");
const path = require("path");
const srcPath = path.join(__dirname, "../src");

const svelteComponent = fs.readFileSync(`${srcPath}/App.svelte`, "utf-8");

const compiledComponent = svelte.compile(svelteComponent, {
    generate: "ssr",
    css: true,
    name: "myApp",
});

fs.writeFileSync(`${srcPath}/dist.js`, compiledComponent.js.code);

esbuild.buildSync({
    entryPoints: [`${srcPath}/dist.js`],
    bundle: true,
    platform: "node",
    write: true,
    outdir: path.join(__dirname, "public"),
});

//
// Enbart i demo syfte, borde vara i en annan fil ._.
//

const myApp = require("./public/dist").default;
const renderedApp = myApp.render({
    passedProp: "passedProp (ssr)",
});

fs.writeFileSync(
    path.join(__dirname, "public/index.html"),
    `
<html>
    <body>
    <style>
        ${renderedApp.css.code}
    </style>
       ${renderedApp.html}
    </body>
</html>
`
);
