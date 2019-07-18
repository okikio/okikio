import Ele from "./ele";
const links = new Ele('nav li.navbar-link');

const Util = {
    routeName(url, path) {
        return path ? url.replace(/\d+/g, ":id") : (url.length > 1 ? url.replace(/\/|\.html|\d/g, "") : "index");
    },
    pageSetup(url) {
        let routeName = Util.routeName(url);

        // Check Active Link
        links.each(link => {
            let a = link.children[0];
            let hrefName = `${a.href}`.replace(`${a.origin}`, "");

            // Clean class
            link.classList.remove('navbar-link-focus');

            // Active link
            if (hrefName == url) {
                link.classList.add('navbar-link-focus');
            }
        });

        document.body.className = `page-${routeName.includes("project") ? (routeName.includes("project-list") ? "project-list" : "project") : routeName}`;
    }
};

export default Util;