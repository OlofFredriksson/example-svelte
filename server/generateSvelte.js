import fs from "node:fs";
import { compile } from "svelte/compiler";
import { render } from "svelte/server";
import esbuild from "esbuild";
import path from "node:path";

const __dirname = import.meta.dirname;
const srcPath = path.join(__dirname, "../src");

const svelteComponent = fs.readFileSync(`${srcPath}/App.svelte`, "utf-8");

const compiledComponent = compile(svelteComponent, {
    generate: "ssr",
    css: "injected",
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

const renderedApp = render(myApp, {
    props: {
        passedProp: "passedProp (ssr)",
    },
});

fs.writeFileSync(
    path.join(__dirname, "public/index.html"),
    `
<html>
    <body>
       ${renderedApp.head}
       ${renderedApp.body}
    </body>
</html>
`
);
