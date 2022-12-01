// source: https://bobbyhadz.com/blog/typescript-property-does-not-exist-on-type-window

export {};

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    _env_: any; // turn off type checking
  }
}
