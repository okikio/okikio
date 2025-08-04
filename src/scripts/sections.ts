// @filename: section-observer.ts
import type { Controller } from "./_types";

/**
 * Intersection observer handler using handleEvent pattern
 */
const observerHandler = {
  isUpdating: false,
  onHashChange: null as ((hash: string) => void) | null,

  handleEvent(this: IntersectionObserver, entries: IntersectionObserverEntry[]) {
    if (observerHandler.isUpdating) return;

    const visibleEntry = entries.find(entry => entry.intersectionRatio >= 0.25);
    if (!visibleEntry) return;

    const sectionId = visibleEntry.target.getAttribute('nav-section');
    if (!sectionId) return;

    observerHandler.isUpdating = true;
    requestAnimationFrame(() => {
      const newHash = `#${sectionId}`;
      window.history.replaceState(null, '', newHash);
      observerHandler.onHashChange?.(newHash);
      observerHandler.isUpdating = false;
    });
  }
};

/**
 * Creates disposable section intersection observer
 */
export function createSectionObserver(onHashChange: (hash: string) => void): Controller | null {
  const sections = document.querySelectorAll<HTMLElement>('[nav-section]');
  if (sections.length <= 0) return null;

  observerHandler.onHashChange = onHashChange;

  const observer = new IntersectionObserver(observerHandler.handleEvent, {
    threshold: [0.25],
    rootMargin: '0px 0px -100px 0px'
  });

  return {
    start() {
      const sections = document.querySelectorAll<HTMLElement>('[nav-section]');
      if (sections.length <= 0) return null;

      sections.forEach(section => observer.observe(section));
    },

    [Symbol.dispose]() {
      sections.forEach(section => observer.unobserve(section));
    }
  };
}