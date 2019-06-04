import data from '../../config.js';
import _template from 'lodash.template';
import Page from '../components/page';

const Project = Page.create({
    name: "project",
    fn(...args) {
        this.renderEle = Page.ele("[render]");
        Page.base.call(this, ...args);
        
        let [ url ] = args;
        let num = Number(url.match(/\d+/g).join([])) || 0;
        let length = data.projects.length;
        let prevNum = (num - 1) < 0 ? (length - 1) : num - 1;
        let nextNum = (num + 1) > (length - 1) ? 0 : num + 1;
        this.renderEle.each(el => {
            el.innerHTML = _template(el.innerHTML, { 
                interpolate: /\%\=(.+?)\%/g
            })
            ({
                ...data.projects[num],
                nextNum: nextNum, prevNum: prevNum,
                next: data.projects[nextNum],
                prev: data.projects[prevNum]
            });
            
            this.img = Page.img("load-img");
        });
        this.img.start();
    }
});

export default Project;