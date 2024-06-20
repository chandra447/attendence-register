import { writable } from "svelte/store"
import { tableFilters } from "../../stores/data"

export const createFilterStore = (data) =>{
    const {subscribe,set,update} = writable({
        data: data,
        filtered: data,
        filter: 0,
        trigger: false,
    })

    return {subscribe,set,update}
}

export const filterHandler=(store)=>{
    const filter = store.filter;
    store.filtered  = (() => {
        switch (tableFilters[filter]) {
          case 'All':
            return store.data;
          case 'Absent':
            return store.data.filter(x => !x.present);
          case 'Present':
            return store.data.filter(x => x.present && !x.disabledCheckout);
          case 'Out-shop':
            return store.data.filter(x => !x.disabledCheckin && x.present);
          default:
            return store.data;
        }
      })();



}

// export const updateStatehandler=(filter,store){
//     // update the employee object in the store
//     store.data = store.data.filter(emp=>{
//         if (emp.id===filter.id){
//             switch (filter.filter){
//                 case 'Present':
//                     if(emp.transaction===0){
//                         return {
//                             ...emp,
//                             present: !emp.present,
//                             disabledCheckin: true,
//                             disabledCheckout: false,
//                             transaction: 1
//                           };
//                     }
//                 default:
//                     return emp;
//             }
//         }
   
//     });
//     return filterHandler(store);


// }
