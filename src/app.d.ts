/// <reference types="unplugin-icons/types/svelte" />
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      userID?: string;
    }
    // interface PageData {}
    // interface Platform {}
  }
}

export {};
