<script>
import { getModalStore } from '@skeletonlabs/skeleton';
import { get } from 'svelte/store';
import { page, updated } from '$app/stores';
import { popup,ListBox,ListBoxItem } from '@skeletonlabs/skeleton';
import { onMount } from 'svelte';
import { fetchStartDate } from '$lib/utils';
import { triggerRefresh,resetStore,triggerRefreshTime,restoreTime } from '../../stores/data';
import Table from '../../components/table.svelte';
import moment from 'moment-timezone';

 


const popupCombobox= {
	event: 'click',
	target: 'popupCombobox',
	placement: 'bottom',
	closeQuery: '.listbox-item'
};

let refreshEmployees=false;
let refreshLedger = false;

triggerRefresh.subscribe( value=>{
	refreshEmployees = value.employees;
	refreshLedger = value.ledgers;

	if (refreshEmployees){
		fetchEmployees();
		resetStore()

	}
	if (refreshLedger){
		fetchLedgers();
		if (startTime.length===0){
		selectStartTrigger();
	}
		resetStore();
	}
})


export let data;
let fetchingEmployees = false;
const modalStore = getModalStore();
//fetch the ledgers we got from onload
let ledgers = get(page).data.ledgers;
$: selectedLedgerindex = 0;
$: selectedLedger = ledgers[selectedLedgerindex];
// Fucntion to fetch ledgers
const fetchLedgers = async(newLedgerName=null) =>{
	const response = await fetch('/ledger',{method:'GET'});
	if (response.ok){
		ledgers = await response.json();
		if(newLedgerName){
			selectedLedgerindex = ledgers.findIndex(ledger => ledger.name === newLedgerName);
		}
	}else{
		console.log('Failed to fetch ledgers');
	}
};
$:  employees=[];

$: selectedDate = moment.utc().tz('Asia/Kolkata').format('YYYY-MM-DD');

async function fetchEmployees() {
		fetchingEmployees = true;
		const response = await fetch(`/employees?register=${selectedLedger.id}&inputDate=${selectedDate}`, {
            method: 'GET'
        });
	
		if (response.ok){
			employees = await response.json();
			let responseMessage = 'Employees fetched Sucessfully'	
		}else{
			const error = await response.json();
			let responseMessage = error.message
		}
		fetchingEmployees = false;

};
$: startTime = get(page).data.startTime
$: startTimeDisplay = startTime.length>0? moment.utc(startTime[0].StartDateTime.replace(" ","T")).tz('Asia/Kolkata').format("HH:mm"):0

function selectStartTrigger() {
	
	const modal = {
		type: 'component',
		component: 'selectStartComponent',
		title: 'Select Date',
		meta: {currentCollection:selectedLedger},
		
	};
	// @ts-ignore
	modalStore.trigger(modal);
};
async function updateStartTime(dateSelected){
	startTime = await fetchStartDate(selectedLedger.id)
}

triggerRefreshTime.subscribe((value)=>{
	if (value===true){
		updateStartTime();
		restoreTime();
	}
});
onMount(() => {
  if (ledgers.length >0) {
	if (startTime.length===0){
		selectStartTrigger();
	}

    fetchEmployees();
  }
});


let ledgerOperation='create';

//function to handle the create user modal
function modalComponentForm() {
	
		const modal = {
			type: 'component',
			component: 'CreateUser',
			meta: {currentCollection:selectedLedger},
			title: 'Create Employee',
			response: (/** @type {any} */ r) => fetchStartDate(),
		};
		// @ts-ignore
		modalStore.trigger(modal);
	};

//function to handle the create ledger modal
function modalLedger() {
	const modal = {
		type: 'component',
		component: 'createLedgerComponent',
		title: ledgerOperation==="create"? 'Create ledger' : 'Delete Ledger',
		meta: {operation:ledgerOperation,ledgerList:ledgers},
		response: (/** @type {any} */ r) => fetchLedgers(),
	};
	// @ts-ignore
	modalStore.trigger(modal);
}

function placeholderArray(placeholderCount) {
    return Array(placeholderCount).fill(null);
  }

  async function handleItemClick(index) {
    selectedLedgerindex = index;
	selectedLedger = ledgers[selectedLedgerindex]
	startTime = await fetchStartDate(selectedLedger.id);

    await fetchEmployees();
	if (startTime.length===0){
		selectStartTrigger();
	}
  }


  const adminDisplay = !data.user.isAdmin? 'hidden' : '';

  async function fetchStartDateWrapper(selectedDatePass) {

  startTime= await fetchStartDate(selectedLedger.id, selectedDatePass);
}
</script>
<div class="mb-4 mt-7 mx-2 bg-surface-200  rounded-lg  flex flex-col ">
	<div class="card-header  justify-items-stretch">
		<div class="flex flex-col space-y-6 mt-7">
			<div class="grid grid-cols-6 justify-items-stretch mt-3">
				<h2 class="h3 mb-4 col-span-4">Hello {data.user.isAdmin? data.user.name :data.user.username} 👋🏻</h2>
				<button  class={'btn px-2 h-8 md:h-12 variant-filled-primary col-start-6 justify-self-end text-nowrap text-xs '+(adminDisplay)} on:click={modalComponentForm}>
					
						New User 
						<i class="fa-regular fa-user"></i>
					</button>
			</div>

			<!-- Close new user row -->

			<!-- ledger operations -->
			
			<div class="flex flex-row space-x-3 relative flex-wrap md:space-x-5 items-center">
				<label class="label">

					<button class="btn variant-filled w-48 justify-between" use:popup={popupCombobox} >
						<span class="capitalize">{ledgers.length>0? ledgers[selectedLedgerindex].name : 'No Ledgers'}</span>
						<span>↓</span>
					</button>

					
						
					
				<div class="card w-48 shadow-xl py-2" data-popup="popupCombobox">
					<ListBox rounded="rounded-none">
						{#each ledgers as item,index}
						<ListBoxItem bind:group={selectedLedgerindex} name="ledger" value={index} on:click={() => handleItemClick(index)}> {item.name}</ListBoxItem>
						{/each}
					</ListBox>
					<div class="arrow bg-surface-100-800-token" />
				</div>
			
				
						
				</label>
				<button class="btn px-3 py-2 w-30 rounded-2xl overflow-hidden text-ellipsis variant-ghost-secondary text-xs" on:click={selectStartTrigger}>
					{#if startTime.length>0}
						Start Time: {startTimeDisplay}
						
					{:else}
						Enter Time
					{/if}
				</button>
				

				<!-- Input for new ledger -->
				<button class={'btn btn-sm variant-ghost-primary mt-2 md:mt-0 '+
								(data.user.isAdmin? '': 'hidden')} on:click={()=>{ ledgerOperation='create';modalLedger();}} >New Ledger ✚</button>
				<button class={'btn btn-sm variant-ghost-error mt-2 md:mt-0 '+
								(data.user.isAdmin? '': 'hidden')} on:click={()=>{ ledgerOperation='delete';modalLedger();}} >Delete Ledger -</button>
			</div>
		</div>
		<!-- End ledger operations -->
		

		<!-- employees list -->
		
			
		
	</div>
	
	{#if fetchingEmployees}

			<!-- place holder section -->
			<section class="card w-full pb-10 mt-20 ">
				<div class="p-7 space-y-4">
					<div class="placeholder" />
					{#each placeholderArray(4) as _,index}
						<div class="grid grid-cols-4 gap-8">
							<div class="placeholder-circle w-16" />
							{#each placeholderArray(2) as _,index}
								<div class="placeholder"> </div>
							{/each}
						</div>
					{/each}
					
				</div>
			</section>


	{:else}
		{#if employees.length===0}
			<section class=" w-full justify-center flex pb-10 mt-20  row-span-4">
				<h1 class="h1">
					<span class="bg-gradient-to-br text-6xl  from-red-500 to-yellow-500 bg-clip-text text-transparent box-decoration-clone">
						Add Employees.</span>
				</h1>
			</section>
		{:else}

			<div class="px-1 md:mx-2 min-w-[60vw] mt-2 md:mt-8  min-h-[75%] mb-2 md:h-[80%]">
				
								
							<Table inputEmployees={employees} 
								isAdmin={data.user.isAdmin}
									 startTime={startTimeDisplay!==0? startTimeDisplay : "None"}
									 fetchStartDateFn={fetchStartDateWrapper}
									 startTimeList = {startTime}/>
							
						
							
			</div>
	
			
		{/if}

	{/if}

</div>
