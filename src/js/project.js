let _ = window._;
let Ele = window.Ele;
let Img = window.Img;
let img = new Img("load-img");
let renderEle = new Ele("[render]");

let fetch = window.fetch;
let url = window.location.pathname;
let indx = url.lastIndexOf("/");
let num = Number(url.substring(indx).replace("/", "")) || 0;

fetch("../data.json")
    .then(res => res.json())
    .then(data => {
        let length = data.projects.length;
        let prevNum = (num - 1) < 0 ? (length - 1) : num - 1;
        let nextNum = (num + 1) > (length - 1) ? 0 : num + 1;
        renderEle.each(el => {
            el.innerHTML = _.template(_.unescape(el.innerHTML)) (Object.assign(
                data.projects[num], { 
                nextNum: nextNum, prevNum: prevNum,
                next: data.projects[nextNum],
                prev: data.projects[prevNum]
            }));
            
            img = new Img("load-img");
        });
    })
    .then(() => { img.start(); })
    .catch(err => { console.log(err.message); });
