// @filename: main.ts
import type { Controller } from './_types.ts';

import { createNavigation, hashHandler } from './navigation.ts';
import { createSectionObserver } from './sections.ts';
import { createPerspectiveEffect } from './perspective.ts';
import { createPageLifecycleManager } from './lifecycle.ts';

/**
 * Initializes the complete navigation and interaction system using disposables
 */
export function initializeApp(): Controller {
  const navigation = createNavigation();
  const sectionObserver = createSectionObserver(() => {
    hashHandler.handleEvent({ newURL: window.location.href })
  });
  const perspectiveEffect = createPerspectiveEffect();

  const pageLifecycle = createPageLifecycleManager([
    navigation,
    sectionObserver,
    perspectiveEffect
  ]);

  Promise.resolve().then(() => {
    document.documentElement.classList.add('dom-loaded');
  });

  // Return a disposable that manages the entire app lifecycle
  return {
    start() {
      // Start the page lifecycle manager which will initialize all controllers
      pageLifecycle.start();
    },
    [Symbol.dispose]() {
      // The using declarations will automatically dispose when this scope ends
      // But we can also explicitly dispose the page lifecycle manager
      pageLifecycle[Symbol.dispose]();
    }
  };
}

/**
 * Auto-initialize with disposable pattern
 */
let appInstance: Controller | null = null;

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded and parsed. Initializing app...");
  appInstance = initializeApp();
  appInstance.start();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  appInstance?.[Symbol.dispose]();
});