
<script>
  import {RadioGroup, RadioItem} from '@skeletonlabs/skeleton';
  import { tableFilters } from "../stores/data";
  import { sleep } from "$lib/utils";
  import Spinner from "./spinner.svelte";
  import { getEmployeesInterval,updateAttendance,currentpersistedDate,deleteEmployees } from '$lib/curd';
  import Timer from './timer.svelte';
  import moment from 'moment-timezone';
  import { dateFilter } from '../stores/data';
  import { getToastStore } from '@skeletonlabs/skeleton';
  import { Drawer, getDrawerStore } from '@skeletonlabs/skeleton';
  // import type { DrawerSettings, DrawerStore } from '@skeletonlabs/skeleton';

const drawerStore = getDrawerStore();
const toastStore = getToastStore();
let background = 'variant-filled-success';
function handleDisplayLogs(row){
  const drawerSettings = {
	id: 'example-3',
	// Provide your property overrides:
	bgDrawer: 'bg-purple-900 text-white',
	bgBackdrop: 'bg-gradient-to-tr from-indigo-500/50 via-purple-500/50 to-pink-500/50',
	width: 'w-[280px] md:w-[480px]',
	padding: 'p-4',
	rounded: 'rounded-xl',
  height: 'h-[50vh]',
  duration: 300,
  meta: {Name:row.Name,logs:row.logData ? row.logData: []},
  position: 'right',

};
drawerStore.open(drawerSettings);
}
export let inputEmployees;
const triggertoast=(/** @type {string} */ tmessage, background)=>{
        let t = {
        message: tmessage,
        timeout:10000,
        background: background,
        padding:'p-6',
        hoverable: true
    };
	toastStore.trigger(t);
    }


async function handleTriggerToast(response,Name,todo){
  // const jres = await response.json();
  if (response.ok) {
    
		triggertoast(todo+" success for "+Name,'variant-filled-success')
			
		}else{
		triggertoast(todo+" failed for "+Name,'variant-filled-error')
		console.error('Error submitting form');
			}

};
$: inputDate = moment.utc().tz('Asia/Kolkata').format('YYYY-MM-DD');
let dataRefresh = false;
async function handleUpdateDate(){
  dataRefresh = true;
  //trigger the data refresh without the interval
  let updatedEmployees = await getEmployeesInterval({ interval: 10000, register: inputEmployees[0].register,retrieveDate:inputDate });
  inputEmployees = updatedEmployees;
  dateFilter.set(inputDate);
  dataRefresh = false;
}

dateFilter.subscribe(value=>{
  inputDate = value
});

let filterSelected=0;

$: countFilters = {
  All: inputEmployees.length,
  Absent: inputEmployees.filter(x => !x.present).length,
  Present: inputEmployees.filter(x => x.present && !x.disabledCheckout).length,
  OutShop: inputEmployees.filter(x => !x.disabledCheckin && x.present).length,
}


$: filteredEmployees = (() => {
  switch (tableFilters[filterSelected]) {
    case 'All':
      return inputEmployees;
    case 'Absent':
      return inputEmployees.filter(x => !x.present);
    case 'Present':
      return inputEmployees.filter(x => x.present && !x.disabledCheckout);
    case 'OutShop':
      return inputEmployees.filter(x => !x.disabledCheckin && x.present);
    default:
      return inputEmployees;
  }
})();

$: searchTerm = ""
$: matchedEmployees = filteredEmployees.filter((emp) => 
    emp.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

$: loadingStates = {
  attendenceLoading: false,
  checkinLoading: false,
  checkoutLoading: false,
  id:'',
}
async function handleUpdates(id, action) {
  const emp = inputEmployees.find(x => x.id === id);
  if (!emp) return;

  loadingStates.id = id;
  
  try {
    switch (action) {
      case 'present':
        loadingStates.attendenceLoading = true;
        let presentResponse = await updateAttendance({ employee: emp.id, present: !emp.present, todo: 'attendance',Name:emp['Name'] });
        await handleTriggerToast(presentResponse,emp.Name,'Attendance');
        break;
        
      case 'checkin':
        dataRefresh = true;
        let checkinResponse= await updateAttendance({ present: emp['presentid'], todo: 'checkin' ,Name:emp['Name']});
        await handleTriggerToast(checkinResponse,emp.Name,'checkin');

        break;

      case 'checkout':
      dataRefresh = true;
        let checkoutResponse = await updateAttendance({ present: emp['presentid'], todo: 'checkout',Name:emp['Name'] });
        await handleTriggerToast(checkoutResponse,emp.Name,'checkout');
        break;
        
      default:
        console.error('Unknown action:', action);
        return;
    }
    sleep(1000);
    const updatedEmployees = await getEmployeesInterval({ interval: 5, register: emp.register,retrieveDate:inputDate });
   
    // Update the inputEmployees array with the fresh data
    inputEmployees = updatedEmployees;
    
  } catch (error) {
    console.error(`Error in ${action} operation:`, error);
  } finally {
    loadingStates.attendenceLoading = false;
    dataRefresh=false;
    loadingStates.id = '';
  }
}

// bulk selection
let headSelected = false;
$: selectedEmployees = [];

function onHeadSelected(){
  headSelected = !headSelected
  if(headSelected===true){
    selectedEmployees = inputEmployees.map(emp=> {return emp.id});
  }else{
    selectedEmployees = [];
  }

}
function onChildSelect(id) {
  
  // Find the index of the element with the given id
  let foundIndex = selectedEmployees.findIndex((emp) => emp === id);
  
  // If the element is found, remove it from the array
  if (foundIndex !== -1) {
    selectedEmployees.splice(foundIndex, 1);
    selectedEmployees = selectedEmployees;

  } 
  // If the element is not found, add it to the array
  else {
    selectedEmployees.push(id);
    selectedEmployees = selectedEmployees;
  }
}

async function purgeEmployees(){
  
  let response = await deleteEmployees(selectedEmployees);
  if (response.ok) {
    
		triggertoast("deleted "+selectedEmployees.length+" Employees",'variant-filled-success')
    dataRefresh = true;
    let updatedEmployees = await getEmployeesInterval({ interval: 10000, register: inputEmployees[0].register,retrieveDate:inputDate });
    inputEmployees = updatedEmployees;
			
		}else{
		triggertoast("Error deleting",'variant-filled-error')
		console.error('Error submitting form');
			}
    dataRefresh=false;
    headSelected = false;
    selectedEmployees = [];
}


</script>

<Drawer>
	{#if $drawerStore.id === 'example-3'}
		<!-- (show 'example-1' contents) -->
     <div class="grid grid-row-6 my-10 ">
      <h1 class="h1 underline mx-auto mt-5 bg-gradient-to-br from-red-500 to-green-300 bg-clip-text text-transparent box-decoration-clone">
        {$drawerStore.meta.Name}<hr class="p-0.75 bg-gradient-to-br from-red-500 to-green-300 "></h1>
        <div class="p-5  row-start-3 mt-10">
          {#if $drawerStore.meta.logs.length>0 }
              <table class="table-fixed w-full overflow-hidden rounded-lg ">
                <thead class="bg-slate-500">
                  <tr class="">
                    <th class="border border-gray-300 p-1 text-center">Out-Time</th>
                    <th class="border border-gray-300 p-1 text-center">InTime</th>
                    <th class="border border-gray-300 p-1 text-center">Duration (minutes)</th>
                  </tr>
                </thead>
                <tbody>
                  {#each $drawerStore.meta.logs as log}
                  <tr>
                    <td class="border border-gray-300 p-1 text-center">{moment.utc(log.outTime).tz('Asia/Kolkata').format('HH:mm')}</td>
                    <td class="border border-gray-300 p-1 text-center">{moment.utc(log.inTime).tz('Asia/Kolkata').format('HH:mm')}</td>
                    <td class="border border-gray-300 p-1 text-center">{log.duration}</td>
                  </tr>
                  {/each}
                  
                  <tr>
                    <td class="border border-gray-300 p-2 text-left" colspan="2">Total</td>
                    <td class="border border-gray-300 p-2 text-center font-semibold">{$drawerStore.meta.logs.reduce(
                                                                                        (accumulator,currentObject)=> {
                                                                                            return accumulator + (currentObject.duration || 0);
                                                                                          }, 0
                    )}</td>
                  </tr>
                </tbody>
              </table>
            {:else}<h1>No logs for the employee</h1>
          {/if}
      </div>
      </div>
 

	
	{/if}
</Drawer>

<div class="flex flex-col space-y-6 md:space-y-10 h-[98%] md:h-[95%] px-1 md:px-4">
    <div class={selectedEmployees.length===0? 'hidden': 'md:block hidden' } >
      <button class='variant-filled-error text-wrap rounded-lg px-4 py-2 break-words w-[130px] font-mono text-sm'
                on:click={purgeEmployees}>
        Delete Employees {selectedEmployees.length}
      </button>
    </div>
    <div class="grid grid-cols-3 md:grid-cols-6 grid-rows-1 md:grid-rows-1 " style="margin-top: 5px;">
    
      <div class="col-span-3">
        <RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary" gap='gap-2'>
          {#each tableFilters as filter, index}
            <RadioItem bind:group={filterSelected} name="All" value={index}><span class="text-xs md:text-base">{filter} </span>
                <span class="text-xs text-opacity-85 align-baseline">({countFilters[filter]})</span></RadioItem>
        
          {/each}
        </RadioGroup>
      </div>
        
      <div class={'flex flex-row col-span-3 space-x-5 p-1 mt-2 md:mt-0'}>
        <input type="search" placeholder="Search..." 
        class="placeholder:text-xs placeholder:opacity-60 
        rounded-lg focus:rounded-lg input" bind:value={searchTerm}/>
        <input type="date" class="rounded-md input text-sm" bind:value={inputDate} on:change={handleUpdateDate}/>
      </div>
          
    </div>


    <!-- Responsive Container (recommended) -->
    <div class="shadow-md shadow-gray-700 md:border-2 rounded-md relative h-full pb-2  overflow-auto md:scrollbar  md:scrollbar-thumb-slate-500 md:scrollbar-track-slate-300 md:scrollbar-w-6 md:scrollbar-h-2  no-scrollbar  ">
      <div class={'absolute right-3 z-20 top-0 '+(dataRefresh? 'block': 'hidden')}> <span class={'animate-spin inline-block '}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.9} stroke="currentColor" class="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        
            </span>
      </div>
      <!-- Native Table Element -->
      
      <table class={'table table-hover hidden md:block'}>
        <thead>
          <tr>
            <th style="padding-right: 0px;"><input type="checkbox" checked={headSelected} on:click={onHeadSelected}></th>
            <th>Name</th>
            <th>Present?</th>
            <th>Options</th>
            <th>Notes</th>
          
          </tr>
        </thead>
        <tbody>
          {#each matchedEmployees as row, index}
                    <tr>
                      <td class="pr-0"  ><input type="checkbox" class=" accent-fuchsia-400" checked={selectedEmployees.find((emp) => emp === row.id)? true||headSelected: false||headSelected} on:click={onChildSelect(row.id)}/></td>

                        <td class="font-semibold">
                        <div class="flex flex-col">
                          <span>{row.Name}</span>

                          <div class={(row.disabledCheckin? 'hidden' : 'block') + ' text-red-700'}>
                            <Timer startTime={row.latestCheckoutTime? row.latestCheckoutTime: moment()} setid={row.id}/>
                          </div>
                        </div>
                        </td>
                        <td class="table-cell-fit">
                        <label class="label">
                          <button class="btn btn-icon variant-filled-secondary h-8" 
                          disabled={row.transaction === 1 || currentpersistedDate!==inputDate || dataRefresh} on:click={handleUpdates(row.id,'present')}>
                          
                          {#if row.present}
                              <span> 
                                {#if loadingStates.attendenceLoading && row.id===loadingStates.id}
                              <Spinner/>
                              {:else}
                                ✅
                              {/if}
                              </span>
                            {:else}
                            <span> 
                              {#if loadingStates.attendenceLoading && row.id===loadingStates.id}
                              <Spinner/>
                              {:else}
                                ❌
                              {/if}
                            </span>
                            {/if} 
                            
                          </button>
                            
                        </label>
                        </td>
                        <td class="table-cell-fit">
                        <div class="flex flex-row space-x-2">
                            <button class="btn btn-sm variant-filled-success" disabled={row.disabledCheckin || currentpersistedDate!==inputDate || dataRefresh}
                            on:click={handleUpdates(row.id,'checkin')}>Check-in</button>
                            <button class="btn btn-sm variant-ghost-error" disabled={row.disabledCheckout || currentpersistedDate!==inputDate || dataRefresh}
                            on:click={handleUpdates(row.id,'checkout')}>Check out</button>
                        </div>
                        </td>
                        <td>
                          <p class="text-xs opacity-80 tracking-wide">
                          Total Logs: {row.totalLogs? row.totalLogs : 0}<button on:click={handleDisplayLogs(row)} class="p-2 ml-2 transition duration-150 ease-out hover:ease-in hover:variant-filled-secondary hover:text-white hover:font-bold rounded-full border border-slate-700 inline-block ">&rarr;</button><br/>
                          <span class="font-semibold text-violet-700">Last Checkout</span>: {row.latestCheckoutTime? moment.utc(row.latestCheckoutTime).tz('Asia/Kolkata').format('YYYY/MM/DD HH:mm'):'None'}
                          </p>
                          
                        </td>
                    </tr>
                    {/each}
        </tbody>
        <tfoot>
          
        </tfoot>
      </table>
      <div class="flex flex-col space-y-5 md:hidden relative h-full">
       
        <div class={'absolute right-3 z-20 top-0 '+(dataRefresh? 'block': 'hidden')}> <span class={'animate-spin inline-block '}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.9} stroke="currentColor" class="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          
              </span>
        </div>
        <div class="flex flex-row space-x-4">
          <button class="btn variant-filled-error btn-md w-[20%] py-1 rounded-md mx-2" on:click={onHeadSelected}>Select All</button>
          <button class={'btn variant-filled-error btn-md w-[20%] py-1 rounded-md mx-2 text-wrap text-xs '+ (selectedEmployees.length===0? 'hidden': 'block md:hidden' )} on:click={purgeEmployees}>Delete {selectedEmployees.length} Employees</button>
        </div>
        {#each matchedEmployees as row,index}
              <div class="md:hidden  w-[95%] mx-auto relative bg-gray-400 p-4 rounded-md grid grid-rows-2">
            
                    <input type="checkbox" class="absolute top-1 left-2 accent-pink-500/20" checked={selectedEmployees.find((emp) => emp === row.id)? true||headSelected: false||headSelected} on:click={onChildSelect(row.id)}/>
                    <div class="flex flex-row  mb-1 mt-1">
                      <h1 class="h3 font-semibold row-span-1 mt-1">{row.Name}</h1>
                        <button class="btn btn-md ml-2 rounded-lg px-2 py-1 variant-filled-secondary text-xs "disabled={row.transaction === 1 || currentpersistedDate!==inputDate || dataRefresh} on:change={handleUpdates(row.id,'present')}>
                          {#if row.present}
                              <span> 
                                {#if loadingStates.attendenceLoading && row.id===loadingStates.id}
                              <Spinner/>
                              {:else}
                                ✅
                              {/if}
                              </span>
                            {:else}
                            <span> 
                              {#if loadingStates.attendenceLoading && row.id===loadingStates.id}
                              <Spinner/>
                              {:else}
                                ❌
                              {/if}
                            </span>
                            {/if} 
                        </button>
                        <div class={'mr-auto mt-1 ml-3 text-red-700 p-1 '+(row.disabledCheckin? 'hidden' : 'block')}>
                          <Timer startTime={row.latestCheckoutTime? row.latestCheckoutTime: moment()} setid={row.id}/>
                        </div> 
                      <button class="justify-end ml-auto align-top rounded-full variant-filled-secondary p-1" on:click={handleDisplayLogs(row)}>&rarr;</button>
                    </div>
                    <div class="flex flex-row row-span-1 justify-end">
                      <p class="text-xs opacity-80 tracking-wide mr-auto mt-2">
                        Total Logs: {row.totalLogs? row.totalLogs : 0}<br/>
                        <span class=" mt-1 font-semibold text-violet-700">Last Checkout</span>: {row.latestCheckoutTime? moment.utc(row.latestCheckoutTime).tz('Asia/Kolkata').format('YYYY/MM/DD HH:mm'):'None'}
                        </p>
                      <div class="order-last place-items-end">
                        <button class="btn rounded-lg px-3 py-2 variant-filled-success min-w-22  text-wrap" on:click={handleUpdates(row.id,'checkin')} disabled={row.disabledCheckin || currentpersistedDate!==inputDate || dataRefresh}>checkin</button>
                        <button class="btn rounded-lg px-3 py-2 variant-filled-error min-w-22 text-wrap" on:click={handleUpdates(row.id,'checkout')} disabled={row.disabledCheckout || currentpersistedDate!==inputDate || dataRefresh}>checkout</button>
                      </div>
                
              </div>
            
            </div>
      {/each}
      

    </div>

    </div>
</div>






 