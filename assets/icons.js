let { glyph } = require("./material-icons.json");
const stringify = require('fast-stringify');
let path = require("path");
let fs = require("fs");
let icons = {};
for (let i = 0; i < glyph.length; i ++) {
    let icon = glyph[i];
    let iconName = icon["-glyph-name"];
    if (iconName.length > 1) {
        icons[icon["-glyph-name"]] = icon["-d"];
    }
}

fs.writeFileSync(path.join(__dirname, "material-design-icons.js"), `module.exports=${stringify(icons)};`);