import fs from "fs-extra";
import { compile } from "svelte/compiler";

import esbuild from "esbuild";
import path from "node:path";

const __dirname = import.meta.dirname;

const srcPath = path.join(__dirname, "../src");
const publicPath = path.join(__dirname, "public/");

const file = fs.readFileSync(`${srcPath}/App.svelte`, "utf-8");

const compiledComponent = compile(file, {
    generate: "dom",
    css: "injected",
    name: "myApp",
});

fs.ensureDirSync(publicPath);
fs.writeFileSync(path.join(__dirname, "public/dist.css"), ".foo {}");

fs.writeFileSync(
    `${srcPath}/dist.js`,
    `
    ${compiledComponent.js.code}
    import { mount } from "svelte";
    const app = mount(myApp,{
        target: document.body,
        props: {
            passedProp: 42
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

fs.writeFileSync(
    path.join(__dirname, "public/index.html"),
    `
<html>
    <head>
        <link rel="stylesheet" href="./dist.css" />
    </head>
    <body>
        <script src="./dist.js" type="text/javascript"></script>
    </body>
</html>
`
);
