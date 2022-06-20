const fs = require("fs-extra");
const svelte = require("svelte/compiler");
const esbuild = require("esbuild");
const path = require("path");
const srcPath = path.join(__dirname, "../src");
const publicPath = path.join(__dirname, "public/");

const file = fs.readFileSync(`${srcPath}/App.svelte`, "utf-8");

const compiledComponent = svelte.compile(file, {
    generate: "dom",
    css: false,
    name: "myApp",
});

fs.ensureDirSync(publicPath);
fs.writeFileSync(
    path.join(__dirname, "public/dist.css"),
    compiledComponent.css.code
);

fs.writeFileSync(
    `${srcPath}/dist.js`,
    `
    ${compiledComponent.js.code}
    const app = new myApp({
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
