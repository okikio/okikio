import '@babel/polyfill';
import Util from "./components/util";
import Page from './components/page';

let url = window.location.pathname;
import Index from './pages/index';
import Project from './pages/project';
Util.pageSetup(url);

let route = {
    "/": Index,
    "/project/:id": Project
};

let routeName = Util.routeName(url, true);
let page = route[routeName];
Page.prototype.init.call(page || {}, url);

import './components/barba';



