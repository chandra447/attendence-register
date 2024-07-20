import { writable } from "svelte/store";
import moment from "moment-timezone";

export const registerActive = writable(false);

const initialData = {
    employees: false,
    ledgers: false,

}

export const triggerRefresh = writable(initialData);

export function resetStore() {
    triggerRefresh.set(initialData);
  }

export const triggerRefreshTime = writable(false)
export function restoreTime(){
  triggerRefreshTime.set(false)
}


export const tableFilters = ['All','Absent','Present','OutShop'];


export const dateFilter = writable(moment.utc().tz('Asia/Kolkata').format('YYYY-MM-DD'));
