<script>
import { getModalStore } from '@skeletonlabs/skeleton';

import Employee from "../../components/employee.svelte";
import { get } from 'svelte/store';
import { page, updated } from '$app/stores';
import { popup,ListBox,ListBoxItem } from '@skeletonlabs/skeleton';
import { onMount } from 'svelte';
import { sleep } from '$lib/utils';
 


const popupCombobox= {
	event: 'click',
	target: 'popupCombobox',
	placement: 'bottom',
	closeQuery: '.listbox-item'
};



export let data;
const modalStore = getModalStore();
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

		console.log('berfore sleep ',selectedLedger.id)
		await sleep(2000);
		console.log('after sleep ',selectedLedger.id)

		const response = await fetch(`/employees?register=${selectedLedger.id}`, {
            method: 'GET'
        });
		console.log('fetch employees from modal');
		if (response.ok){
			employees = await response.json();
			let responseMessage = 'Employees fetched Sucessfully'
			console.log(employees)
			console.log('at the end',selectedLedger.id)
		}else{
			const error = await response.json();
			let responseMessage = error.message
		}

};
onMount(() => {
  if (ledgers.length > 0) {
    fetchEmployees();
  }
});

async function handleEmployeeAdded(){
	await fetchEmployees();
}


//function to handle the create user modal
function modalComponentForm() {
	
		const modal = {
			type: 'component',
			component: 'CreateUser',
			meta: {currentCollection:selectedLedger},
			title: 'Create Employee',
			response: (/** @type {any} */ r) => fetchEmployees(),
		};
		// @ts-ignore
		modalStore.trigger(modal);
		handleEmployeeAdded();
	};

//function to handle the create ledger modal
function modalLedger() {
	const modal = {
		type: 'component',
		component: 'createLedgerComponent',
		title: 'make Supervisor',
		response: (/** @type {any} */ r) => fetchLedgers(),
	};
	// @ts-ignore
	modalStore.trigger(modal);
}


	

</script>
<div class="mt-4 mx-4 bg-surface-200 rounded-lg h-[750px] ">
	<div class="card-header">
		<h2 class="h3 mb-4">Hello {data.user.username} 👋🏻</h2>
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
							(data.user.isAdmin? '': 'hidden')} on:click={modalLedger} >New Ledger ✚</button>
		</div>

		<!-- employees list -->
		
			
		
	</div>
	{#if employees.length===0}
		<section class=" w-full justify-center flex pb-10 mt-60">
			<h1 class="h1">
				<span class="bg-gradient-to-br text-6xl  from-red-500 to-yellow-500 bg-clip-text text-transparent box-decoration-clone">
					Add Employees.</span>
			</h1>
		</section>
	{:else}

		<section class="p-4 overflow-y-auto ">
			<div class="flex flex-col mx-auto mt-10 space-y-3 md:mx-20  w-3/4 px-2 over-flow-y-auto h-65
							">
					
						{#each employees as emp}
						<Employee status="In shop" duration="00:45" name={emp.Name} />	
						{/each}
			
		</section>
	{/if}
	<div class="card-footer"></div>
</div>
