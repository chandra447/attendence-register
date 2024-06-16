import { writable } from "svelte/store";

export const registerActive = writable(false);

const initialData = {
    employees: false,
    ledgers: false,

}

export const triggerRefresh = writable(initialData);

export function resetStore() {
    triggerRefresh.set(initialData);
  }