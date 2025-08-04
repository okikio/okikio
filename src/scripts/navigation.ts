// @filename: navigation.ts
import type { Controller } from "./_types";

/**
 * Navigation toggle handler using handleEvent pattern
 */
const toggleHandler = {
  nav: null as HTMLElement | null,

  handleEvent(event: MouseEvent) {
    this.nav?.classList.toggle('open');
  }
};

/**
 * Hash change handler for navigation state updates
 */
export const hashHandler = {
  hashToItem: new Map<string, HTMLElement>(),
  currentHash: '',

  handleEvent(event: HashChangeEvent | { newURL: string }) {
    const url = new URL(event.newURL);
    if (this.currentHash === url.hash) return;

    // Remove active from current item
    const currentItem = this.hashToItem.get(this.currentHash);
    currentItem?.classList.remove('active');

    // Add active to new item
    const newItem = this.hashToItem.get(url.hash);
    newItem?.classList.add('active');

    this.currentHash = url.hash;
  }
};

/**
 * Creates disposable navigation controller
 */
export function createNavigation(): Controller | null {
  const nav = document.querySelector<HTMLElement>('nav');
  const menu = nav?.querySelector<HTMLElement>('.menu');
  const toggle = nav?.querySelector<HTMLElement>('.toggle');
  if (!nav || !menu || !toggle) return null;

  const items = Array.from(menu.querySelectorAll<HTMLElement>('.item'));
  if (items.length <= 0) return null;

  return {
    start() {
      const nav = document.querySelector<HTMLElement>('nav');
      const menu = nav?.querySelector<HTMLElement>('.menu');
      const toggle = nav?.querySelector<HTMLElement>('.toggle');
      if (!nav || !menu || !toggle) return null;

      const items = Array.from(menu.querySelectorAll<HTMLElement>('.item'));
      if (items.length <= 0) return null;

      // Setup toggle handler
      toggleHandler.nav = nav;
      toggle.addEventListener('click', toggleHandler);

      // Setup hash handler
      hashHandler.hashToItem.clear();
      items.forEach(item => {
        const href = item.getAttribute('href') ?? '';
        const url = new URL(href, window.location.href);
        hashHandler.hashToItem.set(url.hash, item);
      });

      // Initialize
      hashHandler.currentHash = window.location.hash;
      hashHandler.handleEvent({ newURL: window.location.href });
    },

    [Symbol.dispose]() {
      toggle.removeEventListener('click', toggleHandler);
      hashHandler.hashToItem.clear();
    }
  };
}