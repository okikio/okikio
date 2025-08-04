// TypeScript interface for the navigation controller
export interface Controller {
  start(): void;
  [Symbol.dispose](): void;
}