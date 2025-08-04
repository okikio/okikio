// @filename: page-lifecycle.ts
import type { Controller } from "./_types";

/**
 * Astro page transition handlers using handleEvent pattern
 */
const pageHandlers = {
  controllers: [] as Array<Controller>,

  handleEvent(event: Event) {
    if (event.type === 'astro:before-swap') {
      this.controllers.forEach(controller => controller[Symbol.dispose]());
    } else if (event.type === 'astro:after-swap') {
      Promise.resolve().then(() => {
        document.documentElement.classList.add('dom-loaded');
      });

      this.controllers.forEach(controller => controller.start());
    }
  }
};

/**
 * Creates disposable page lifecycle manager
 */
export function createPageLifecycleManager(
  controllers: Array<Controller | null>
): Controller {
  const validControllers = controllers.filter((c): c is NonNullable<typeof c> => c !== null);
  pageHandlers.controllers = validControllers;

  document.addEventListener('astro:before-swap', pageHandlers);
  document.addEventListener('astro:after-swap', pageHandlers);

  return {
    start() {
      // Initialize all controllers
      validControllers.forEach(controller => controller.start());
    },
    [Symbol.dispose]() {
      document.removeEventListener('astro:before-swap', pageHandlers);
      document.removeEventListener('astro:after-swap', pageHandlers);
      validControllers.forEach(controller => controller[Symbol.dispose]());
    }
  };
}