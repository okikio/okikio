import { throttle, debounce, generateClientRects, axis, type Rect } from "./util";

let nav = document.querySelector("nav");
let menu = nav?.querySelector?.(".menu");
let items = Array.from(menu?.querySelectorAll?.(".item") ?? []);
let toggle = nav?.querySelector?.(".toggle");

function toggleNav() {
  nav?.classList?.toggle("open");
}

toggle?.addEventListener?.("click", toggleNav);

let lastHash;
let urls = items?.map?.((item) => new URL(item?.getAttribute?.("href"), window.location.href).href);
const hashChange = ({ newURL }) => {
  let _url = new URL(newURL);
  if (lastHash !== _url.hash) {
    let href = _url.href;
    let index = urls.indexOf(href);

    items?.forEach?.((item) => item?.classList.remove("active"));
    if (index > -1) items?.[index]?.classList?.add("active");

    lastHash = _url?.hash;
  }
};

hashChange({ newURL: window.location.href });

let sections = Array.from(document.querySelectorAll("[nav-section]") ?? []) as HTMLElement[];
let oldHash = window.location.hash;
let navHashes = new Map();
items.forEach((item) => {
  let url = new URL(item.getAttribute("href"), window.location.href);
  navHashes.set(url.hash, item);
});

const observer = new IntersectionObserver(debounce((entries) => {
  entries?.forEach?.((entry) => {
    if (entry?.intersectionRatio >= 0.25) {
      let id = entry?.target?.attributes?.["nav-section"]?.value;
      window.history.replaceState(null, null, "#" + id);
      navHashes?.has?.(oldHash) && navHashes?.get(oldHash)?.classList?.remove?.("active");
      navHashes?.has?.("#" + id) && navHashes?.get("#" + id)?.classList?.add?.("active");
      oldHash = window.location.hash;
    }
  });
}, 50), {
  threshold: Array.from({ length: 101 }, (_, x) => x / 100),
  rootMargin: `0px 0px -100px 0px`
});

for (let section of sections) {
  observer.observe(section);
}

let rootEl = document.querySelector("[data-perspective-group]") as HTMLElement;
let els = Array.from(rootEl.querySelectorAll("[data-perspective]")) as HTMLElement[];

let len = els.length;
let elAttrs = els.map(el => el.getAttribute("data-perspective"));
let elClientRects = generateClientRects(els);

function perspectiveCatagory(attr: string, e: MouseEvent, clientRect: Rect, yscale: number) {
  switch (attr) {
    case "header":
      return {
        x: axis("max", "x", 10, -20)(e, clientRect),
        y: `${- yscale * (clientRect.height / 2)}px`,
      };

    case "image":
      return {
        x: axis("min", "x", 5, (clientRect.width / 6) - 40)(e, clientRect),
        y: `calc(-50% + ${yscale * (clientRect.height / 6)}px)`,
      };

    case "scroll-down":
      return {
        x: axis("min", "x", 10, -10)(e, clientRect),
        y: axis("min", "y", 35, 2)(e, clientRect)
      };

    case "social-links":
      return {
        x: axis("min", "x", 10, -5)(e, clientRect),
        y: `${- yscale * clientRect.height * 0.0125}px`,
      };
  }

  return {
    x: axis()(e, clientRect),
    y: axis()(e, clientRect)
  };
};

let height = window.innerHeight;
let registered = false;
function onMousemove(e: MouseEvent) {
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
}

function registerEvent() {
  if (!registered && rootEl) {
    rootEl?.addEventListener?.("mousemove", onMousemove, { passive: true });
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

  if (len >= 0) {
    elClientRects = generateClientRects(els);
  }
}, 1000), { passive: true });

setTimeout(() => {
  const html = document.querySelector("html");
  html.classList.add("dom-loaded");
}, 500);


document.addEventListener("astro:page-load", () => {
  toggle?.removeEventListener?.("click", toggleNav);
  rootEl?.removeEventListener?.("mousemove", onMousemove);
  for (let section of sections) {
    observer.unobserve(section);
  }

  sections = Array.from(document.querySelectorAll("[nav-section]") ?? []) as HTMLElement[];
  registered = false;

  nav = document.querySelector("nav");
  menu = nav?.querySelector?.(".menu");
  items = Array.from(menu?.querySelectorAll?.(".item") ?? []);
  toggle = nav?.querySelector?.(".toggle");

  urls = items?.map((item) => new URL(item?.getAttribute?.("href"), window.location.href).href) ?? [];
  
  navHashes.clear();
  items?.forEach?.((item) => {
    let url = new URL(item?.getAttribute?.("href"), window.location.href);
    navHashes.set(url?.hash, item);
  });

  rootEl = document.querySelector("[data-perspective-group]") as HTMLElement;
  els = Array.from(rootEl?.querySelectorAll?.("[data-perspective]") ?? []) as HTMLElement[];

  len = els?.length ?? 0;
  elAttrs = els?.map(el => el?.getAttribute?.("data-perspective"));
  elClientRects = generateClientRects(els) ?? [];

  const html = document.querySelector("html");
  html?.classList?.add?.("dom-loaded");

  if (
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !window.matchMedia("(pointer: coarse)").matches
  ) registerEvent();

  if (sections.length > 0) {
    for (let section of sections) {
      observer.observe(section);
    }
  }

  toggle?.addEventListener?.("click", toggleNav);
  hashChange({ newURL: window.location.href });
})

export { };
