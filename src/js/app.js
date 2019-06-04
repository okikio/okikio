import Util from "./components/util";
import Page from './components/page';

let url = window.location.pathname;
import Index from './pages/index';
Util.pageSetup(url);

let route = {
    "/": Index
};

let routeName = Util.routeName(url, true);
let page = route[routeName];
Page.prototype.init.call(page || {}, url);

import './components/barba';



