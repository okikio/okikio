let browserlist = {
    "modern": ["> 10%"],
    "general": ["defaults, IE 8"]
};

let babelConfig = ["modern", "general"]
.reduce((acc, type) => {
    acc[type] = {
        "babelrc": false,
        "presets": [
            ["@babel/preset-env", {
                "useBuiltIns": false,
                "modules": 'false',
                "targets": {
                    "browsers": browserlist[type]
                }
            }]
        ]
    };
    return acc;
}, {
    "node": {
        "presets": ["@babel/preset-env"]
    }
});

let _export = { babelConfig, ...browserlist };
module.exports = _export;