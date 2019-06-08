let template = require('lodash.template');
let path = require('path');
let fs = require("fs");

// Config File
let config = require("./src/config");

// For faster more efficient page switching
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// Render Engine
let engine = (filePath, opts, callback) => {
    let barba = opts.barba, data = opts.data, val, dom;
    fs.readFile(filePath, function(err, content) {
        if (err) return callback(err);
        val = content.toString();
        dom = new JSDOM(val).window.document;
        
        if (data) {
            let tempDOM;
            val = template(dom.querySelector('[render]').outerHTML, { 
                interpolate: /\%\=(.+?)\%/g
            }) (data);
            tempDOM = new JSDOM(val).window.document.documentElement;
            dom.querySelector('[render]').replaceWith(tempDOM);
            val = dom.documentElement.outerHTML;
        }
        
        if (barba) {
            dom = dom.querySelector('[data-barba="container"]');
            val = dom.outerHTML;
        }
        
        return callback(null, val);
    });
};

let length = config.projects.length;
config.projects.forEach((project, num) => {
    let prevNum = (num - 1) < 0 ? (length - 1) : num - 1;
    let nextNum = (num + 1) > (length - 1) ? 0 : num + 1;
    
    engine(path.join(__dirname, 'public') + "/project.html", {
        data: {
            nextNum: nextNum, prevNum: prevNum,
            next: config.projects[nextNum],
            prev: config.projects[prevNum],
            ...project
        }
    }, ($, val) => {
        fs.writeFile(`public/project-${num}.html`, val, (err) => {
            if (err) throw err;
            console.log(`Project ${num}: The file has been saved!`);
        });
    });
});
module.exports.engine = engine;
