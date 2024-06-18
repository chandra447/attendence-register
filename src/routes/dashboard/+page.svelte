<script>
import { filter, getModalStore } from '@skeletonlabs/skeleton';

import Employee from "../../components/employee.svelte";
import { get } from 'svelte/store';
import { page, updated } from '$app/stores';
import { popup,ListBox,ListBoxItem } from '@skeletonlabs/skeleton';
import { onMount } from 'svelte';
import { sleep } from '$lib/utils';
import { triggerRefresh,resetStore } from '../../stores/data';
import Table from '../../components/table.svelte';
import {RadioGroup, RadioItem} from '@skeletonlabs/skeleton';
import { tableFilters } from '../../stores/data';
 


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
		resetStore();
	}
})


export let data;
let fetchingEmployees = false;
const modalStore = getModalStore();
//fetch the ledgers we got from onload
let ledgers = get(page).data.ledgers;
let selectedLedgerindex = 0;
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

async function fetchEmployees() {
		fetchingEmployees = true;
		await sleep(2000);

		const response = await fetch(`/employees?register=${selectedLedger.id}`, {
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
onMount(() => {
  if (ledgers.length > 0) {
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
			response: (/** @type {any} */ r) => console.log('response:', r),
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


let selectedFilter = 0;

</script>
<div class="mt-4 mx-4 bg-surface-200 rounded-lg h-[750px] ">
	<div class="card-header">
		<h2 class="h3 mb-4">Hello {data.user.isAdmin? data.user.name :data.user.username} 👋🏻</h2>
		<!-- New user row -->
		<div class="flex flex-row space-x-0 md:space-x-5 relative flex-wrap">
			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] order-first w-full
			md:w-1/2">
				<div class="input-group-shim"><i class="fa-brands fa-searchengin"></i></div>
				<input type="search" placeholder="Search..." />
				
			</div>
			<!-- <button class="btn variant-filled" use:popup={popupFeatured}>Show Popup</button> -->
			<div class="flex space-x-3 md:flex-none md:space-x-0">
				<input type="date" class="btn btn-sm mt-2 md:mt-0 "/>
						
				
				
				<button  class={'btn btn-md md:btn-xl variant-filled-primary order-last '+
							'md:absolute md:right-0 ' +
							'mt-2 md:mt-0 '+(data.user.isAdmin? '': 'hidden')} on:click={modalComponentForm}>
					<span class={'space-x-4 text-xs font-light md:font-md '
							}>
					New User 
					<i class="fa-regular fa-user"></i></span>
				</button>
			</div>

		</div >
		<!-- Close new user row -->

		<!-- ledger operations -->
		
		<div class="flex flex-row space-x-3 relative mt-2 flex-wrap md:space-x-5 items-center">
			<label class="label">

				<button class="btn variant-filled w-48 justify-between" use:popup={popupCombobox} >
					<span class="capitalize">{ledgers.length>0? ledgers[selectedLedgerindex].name : 'No Ledgers'}</span>
					<span>↓</span>
				</button>

				
					
				
			<div class="card w-48 shadow-xl py-2" data-popup="popupCombobox">
				<ListBox rounded="rounded-none">
					{#each ledgers as item,index}
					<ListBoxItem bind:group={selectedLedgerindex} name="medium" value={index} on:click={fetchEmployees}> {item.name}</ListBoxItem>
					{/each}
				</ListBox>
				<div class="arrow bg-surface-100-800-token" />
			</div>
		
			
					
			</label>
			

			<!-- Input for new ledger -->
			 <button class={'btn btn-sm variant-ghost-primary mt-2 md:mt-0 '+
							(data.user.isAdmin? '': 'hidden')} on:click={()=>{ ledgerOperation='create';modalLedger();}} >New Ledger ✚</button>
			<button class={'btn btn-sm variant-ghost-error mt-2 md:mt-0 '+
							(data.user.isAdmin? '': 'hidden')} on:click={()=>{ ledgerOperation='delete';modalLedger();}} >Delete Ledger -</button>
		</div>
		<!-- Close ledger operations -->
		

		
		


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
			<section class=" w-full justify-center flex pb-10 mt-60">
				<h1 class="h1">
					<span class="bg-gradient-to-br text-6xl  from-red-500 to-yellow-500 bg-clip-text text-transparent box-decoration-clone">
						Add Employees.</span>
				</h1>
			</section>
		{:else}

			<section class="p-4 overflow-y-auto ">
				<div class="flex flex-col mx-auto mt-10 space-y-5 md:mx-20  w-3/4 px-2 over-flow-y-auto h-65
								">
								<div>
									<RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary" gap='gap-2'>
										{#each tableFilters as filter, index}
											<RadioItem bind:group={selectedFilter} name="All" value={index}>{filter}</RadioItem>
									
										{/each}
									</RadioGroup>
								</div>
							<Table inputEmployees={employees} filterSelected={selectedFilter}/>
							
			</section>
			
		{/if}

	{/if}
	<div class="card-footer"></div>
</div>
