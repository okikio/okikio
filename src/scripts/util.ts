// @filename: util.ts
/**
 * Generates client rectangles adjusted for scroll position
 */
export const generateClientRects = (elements: HTMLElement[]): DOMRect[] => {
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  
  return elements.map(element => {
    const rect = element.getBoundingClientRect();
    return new DOMRect(
      rect.left + scrollX,
      rect.top + scrollY,
      rect.width,
      rect.height
    );
  });
};

/**
 * Core movement calculation logic
 */
export const axis = (
  axis: 'x' | 'y',
  options: { sensitivity?: number; min?: number; max?: number },
  event: MouseEvent,
  rect: DOMRect
): string => {
  const { sensitivity = 20, min, max } = options;
  
  const mousePos = axis === 'x' ? event.clientX : event.clientY;
  const elementPos = axis === 'x' ? rect.x : rect.y;
  
  let movement = (mousePos - elementPos) / sensitivity;
  
  // Proper clamping - both min and max can be applied together
  if (min !== undefined) movement = Math.max(movement, min);
  if (max !== undefined) movement = Math.min(movement, max);
  
  return `${movement}px`;
};
