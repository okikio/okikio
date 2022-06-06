import { throttle, debounce, generateClientRects, axis, type Rect } from "./util";

const html = document.querySelector("html");
html.classList.add("dom-loaded");

let nav = document.querySelector("nav");
let menu = nav.querySelector(".menu");
let items = Array.from(menu.querySelectorAll(".item"));
let toggle = nav.querySelector(".toggle");

toggle.addEventListener("click", () => {
  nav.classList.toggle("open");
});

let lastHash;
let urls = items.map((item) => new URL(item.getAttribute("href"), window.location.href).href);
const hashChange = ({ newURL }) => {
  let _url = new URL(newURL);
  if (lastHash !== _url.hash) {
    let href = _url.href;
    let index = urls.indexOf(href);

    items.forEach((item) => item.classList.remove("active"));
    if (index > -1) items[index].classList.add("active");

    lastHash = _url.hash;
  }
};

hashChange({ newURL: window.location.href });

let sections = Array.from(document.querySelectorAll("[nav-section]")) as HTMLElement[];
let headerIds = sections.map(elem => elem.querySelector("h1[id], h2[id], h3[id]").id);

let navHeight = nav.getBoundingClientRect().height;
let clientRects = generateClientRects(sections)
  .map((value, index) => ({ ...value, id: headerIds[index] }));

let innerHeight = window.innerHeight;
let oldHash = window.location.hash;
let navHashes = new Map();
items.forEach((item) => { 
  let url = new URL(item.getAttribute("href"), window.location.href); 
  navHashes.set(url.hash, item);
});

window.addEventListener("scroll", throttle(() => {
  let scrollTop = window.scrollY;
  for (let { id, top, height } of clientRects) {
    let offsetScrollY = scrollTop + innerHeight - navHeight; // - (navHeight * 2);
    if (offsetScrollY >= top && offsetScrollY <= top + height) {
      window.history.replaceState(null, null, "#" + id);
      navHashes.get(oldHash).classList.remove("active");
      navHashes.get("#" + id).classList.add("active");
      // hashChange({ newURL: window.location.href });
      oldHash = window.location.hash;
    }
  }
}, 100), { passive: true });

let rootEl = document.querySelector("[perspective-group]");
let els = Array.from(rootEl.querySelectorAll("[perspective]")) as HTMLElement[];

let len = els.length;
let elAttrs = els.map(el => el.getAttribute("perspective"));
let elClientRects = generateClientRects(els);

let perspectiveCatagory = (attr: string, e: MouseEvent, clientRect: Rect, yscale: number) => {
  switch (attr) {
    case "header":
      return {
        x: axis("max", "x", 10, -20)(e, clientRect),
        y: `${- yscale * (clientRect.height / 2)}px`// `${-e.clientY / 20}px`,
      };

    case "image":
      return {
        x: axis("min", "x", 5, (clientRect.width / 6) - 40)(e, clientRect),
        y: `calc(-50% + ${yscale * (clientRect.height / 6)}px)` // `${(clientRect.height)}px`,
      };

    case "scroll-down":
      return {
        x: axis("min", "x", 10, -10)(e, clientRect),
        y: axis("min", "y", 35, 2)(e, clientRect)
      };

    case "social-links":
      return {
        x: axis("min", "x", 10, -5)(e, clientRect),
        y: `${- yscale * clientRect.height * 0.125}px`// `${-e.clientY / 20}px`,
      };
  }

  return {
    x: axis()(e, clientRect),
    y: axis()(e, clientRect)
  };
};

let height = window.innerHeight;
let registered = false;
function registerEvent() {
  if (!registered) {
    rootEl?.addEventListener("mousemove", (e: MouseEvent) => {
      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        window.matchMedia("(pointer: coarse)").matches
      ) return;

      let yscale = (e.clientY / height) - 0.5;
      for (let i = 0; i < len; i++) {
        let el = els[i];
        let clientRect = elClientRects[i];
        let name = elAttrs[i];

        let { x, y } = perspectiveCatagory(name, e, clientRect, yscale);
        el.style.transform = `translate(${x}, ${y})`;
      }
    }, { passive: true });
  }
    
  registered = true;
}

if (
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
  !window.matchMedia("(pointer: coarse)").matches
) registerEvent();

window.matchMedia("(prefers-reduced-motion: reduce)")
  ?.addEventListener?.("change", registerEvent);
window.matchMedia("(pointer: coarse)")
  ?.addEventListener?.("change", registerEvent);

window.addEventListener("resize", debounce(() => {
  height = window.innerHeight;
  navHeight = nav.getBoundingClientRect().height;
  elClientRects = generateClientRects(els);
  clientRects = generateClientRects(sections)
    .map((value, index) => ({ ...value, id: headerIds[index] }));
}, 1000), { passive: true });

export { };