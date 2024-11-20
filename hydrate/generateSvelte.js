import fs from "fs-extra";
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
    platform: "node",
    write: true,
    format: "esm",
    outdir: path.join(__dirname, "public"),
});

//
// Enbart i demo syfte, borde vara i en annan fil ._.
//

const mySSRApp = (await import("./public/dist.js")).default;
const renderedApp = mySSRApp.render({
    passedProp: "passedProp (hydrate)",
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
       <script src="./dist.js" type="text/javascript"></script>
    </body>
</html>
`
);

//
// Kompilera filen på nytt, åt klienten (i.e typ samma som återfinns i /client/ )
//

const compiledClientComponent = compile(svelteComponent, {
    generate: "dom",
    name: "myApp",
    hydratable: true,
});

fs.writeFileSync(
    `${srcPath}/dist.js`,
    `
    ${compiledClientComponent.js.code}
    const app = new myApp({
        target: document.body,
        hydrate: true,
        props: {
            passedProp: "passedProp (hydrate / client)"
        }
    });
`
);

const bundle = esbuild.buildSync({
    entryPoints: [`${srcPath}/dist.js`],
    bundle: true,
    platform: "browser",
    write: true,
    outdir: path.join(__dirname, "public"),
});
