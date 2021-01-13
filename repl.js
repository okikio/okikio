// const promise1 = Promise.resolve({ default: 6 });
// const promise2 = Promise.resolve({ default: 5 });
// const promise3 = Promise.resolve({ default: 15 });
(async () => {
    const [{ default: pug }] = await Promise.all([
        Promise.resolve({ default: 6 }),
        Promise.resolve({ default: 5 }),
        Promise.resolve({ default: 15 }),
    ]);
    console.log(pug);
})();


default,es2015,es2016,es2017,es2018,Object.entries,fetch,IntersectionObserver,IntersectionObserverEntry,smoothscroll,matchMedia,localStorage,getComputedStyle,Element.prototype.scrollIntoView