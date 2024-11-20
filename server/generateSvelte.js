import fs from "node:fs";
import { compile } from "svelte/compiler";
import esbuild from "esbuild";
import path from "node:path";

const __dirname = import.meta.dirname;
const srcPath = path.join(__dirname, "../src");

const svelteComponent = fs.readFileSync(`${srcPath}/App.svelte`, "utf-8");

const compiledComponent = compile(svelteComponent, {
    generate: "ssr",
    css: true,
    name: "myApp",
});

fs.writeFileSync(`${srcPath}/dist.js`, compiledComponent.js.code);

esbuild.buildSync({
    entryPoints: [`${srcPath}/dist.js`],
    bundle: true,
    format: "esm",
    platform: "node",
    write: true,
    outdir: path.join(__dirname, "public"),
});

//
// Enbart i demo syfte, borde vara i en annan fil ._.
//

const myApp = (await import("./public/dist.js")).default;

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
