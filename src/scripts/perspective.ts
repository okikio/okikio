
// @filename: perspective.ts
import type { Controller } from './_types.ts';
import { generateClientRects, axis } from './util.ts';

export interface MovementConfig {
  type?: string | null;
  event: MouseEvent;
  rect: DOMRect;
  verticalOffset: number;
}

/**
 * Movement configurations for different element categories
 * Clean and readable with direct function calls
 */
const calculateTransform = ({ type, event, rect, verticalOffset }: MovementConfig) => {
  switch (type) {
    case 'header': {
      return {
        x: axis('x', { sensitivity: 10, min: -20 }, event, rect),
        y: `${-verticalOffset * (rect.height / 2)}px`
      };
    }
      
    case 'image': {
      return {
        x: axis('x', { sensitivity: 5, max: (rect.width / 6) - 40 }, event, rect),
        y: `${verticalOffset * (rect.height / 6)}px`
      };
    }
    
    case 'scroll-down': {
      return {
        x: axis('x', { sensitivity: 10, max: -10 }, event, rect),
        y: axis('y', { sensitivity: 35, max: 2 }, event, rect)
      };
    }
    
    case 'social-links': {
      return {
        x: axis('x', { sensitivity: 10, max: -5 }, event, rect),
        y: `${-verticalOffset * rect.height * 0.0125}px`
      };
    }
    
    // Default fallback with no limits
    default: {
      return {
        x: axis('x', {}, event, rect),
        y: axis('y', {}, event, rect)
      };
    }
  }
};

/**
 * Mouse move handler using handleEvent pattern
 */
const mouseMoveHandler = {
  elementData: [] as Array<{ element: HTMLElement; attribute: string | null }>,
  clientRects: [] as DOMRect[],
  windowHeight: window.innerHeight,
  root: null as HTMLElement | null,
  
  handleEvent(event: MouseEvent) {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    ) return;

    // Calculate mouse position relative to window center (-0.5 to 0.5)
    const verticalOffset = (event.clientY / this.windowHeight) - 0.5;
    
    for (let i = 0; i < this.elementData.length; i++) {
      const { element, attribute } = this.elementData[i];
      const rect = this.clientRects[i];
      
      const { x, y } = calculateTransform({ type: attribute, event, rect, verticalOffset });
      element.style.transform = `translate(${x}, ${y})`;
    }
  }
};

/**
 * Resize handler using handleEvent pattern
 */
const resizeHandler = {
  handleEvent() {
    mouseMoveHandler.windowHeight = window.innerHeight;
    if (mouseMoveHandler.elementData.length > 0) {
      mouseMoveHandler.clientRects = generateClientRects(
        mouseMoveHandler.elementData.map(({ element }) => element)
      );
    }
  }
};

/**
 * Media query change handler using handleEvent pattern
 */
const mediaQueryHandler = {
  isActive: false,
  
  handleEvent() {
    const shouldEnable = 
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      !window.matchMedia('(pointer: coarse)').matches;
    
    if (shouldEnable && !this.isActive) {
      mouseMoveHandler.root?.addEventListener('mousemove', mouseMoveHandler, { passive: true });
      this.isActive = true;
    } else if (!shouldEnable && this.isActive) {
      mouseMoveHandler.root?.removeEventListener('mousemove', mouseMoveHandler);
      this.isActive = false;
    }
  }
};

/**
 * Creates disposable perspective effect controller
 */
export function createPerspectiveEffect(): Controller | null {
  // Setup media query listeners
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarsePointerQuery = window.matchMedia('(pointer: coarse)');
  
  return {
    start() {
      const root = document.querySelector<HTMLElement>('[data-perspective-group]');
      if (!root) return null;

      const elements = Array.from(root.querySelectorAll<HTMLElement>('[data-perspective]'));
      if (elements.length <= 0) return null;

      // Setup handlers
      mouseMoveHandler.root = root;
      mouseMoveHandler.elementData = elements.map(el => ({
        element: el,
        attribute: el.getAttribute('data-perspective')
      }));
      mouseMoveHandler.clientRects = generateClientRects(elements);
      
      reducedMotionQuery.addEventListener('change', mediaQueryHandler);
      coarsePointerQuery.addEventListener('change', mediaQueryHandler);
      window.addEventListener('resize', resizeHandler, { passive: true });

      // Initialize
      mediaQueryHandler.handleEvent();
    },
    
    [Symbol.dispose]() {
      mouseMoveHandler.root?.removeEventListener('mousemove', mouseMoveHandler);
      reducedMotionQuery.removeEventListener('change', mediaQueryHandler);
      coarsePointerQuery.removeEventListener('change', mediaQueryHandler);
      window.removeEventListener('resize', resizeHandler);
      mediaQueryHandler.isActive = false;
    }
  };
}