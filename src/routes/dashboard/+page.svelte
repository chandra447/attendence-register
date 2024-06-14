<script>
import { getModalStore } from '@skeletonlabs/skeleton';

import Employee from "../../components/employee.svelte";
import { get } from 'svelte/store';
import { page } from '$app/stores';
  import { onMount } from 'svelte';

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


//function to handle the create user modal
function modalComponentForm() {
	
		const modal = {
			type: 'component',
			component: 'CreateUser',
			meta: {currentCollection:selectedLedger},
			title: 'Create Employee',
			response: (/** @type {any} */ r) => { (ledgers=fetchLedgers())}
		};
		// @ts-ignore
		modalStore.trigger(modal);
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
<div class="card mt-4 mx-4 ">
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
	
				<select class="select font-bold mt-2 variant-outline-primary input-group" size="1" bind:value={selectedLedgerindex}>
					{#if ledgers.length > 0}
						{#each ledgers as item, index}
							<option value={index} selected={index === selectedLedgerindex}>{item.name}</option>
						{/each}
					{:else}
						<option value="create">Create a new ledger</option>
					{/if}
				</select>
	
				
			</label>
			

			<!-- Input for new ledger -->
			 <button class={'btn btn-sm variant-ghost-primary mt-2 md:mt-0 '+
							(data.user.isAdmin? '': 'hidden')} on:click={modalLedger} >New Ledger ✚</button>
		</div>

		<!-- employees list -->
		
			
		
	</div>
	<section class="p-4 overflow-y-auto ">
		<div class="flex flex-col mx-auto mt-10 space-y-3 md:mx-20  w-3/4 px-2 over-flow-y-auto h-65
						">
			{#if ledgers[selectedLedgerindex]==="Main Road"}
				<Employee status="In shop" duration="00:45" name="Zoro" />	
				<Employee status="Outside shop" duration="00:55" name="sanji" />	
				<Employee status="In shop" duration="00:15" name="luffy" />	
				<Employee status="Outside shop" duration="00:55" name="Nami" />		
			{:else}	
				<Employee status="In shop" duration="00:45" name="Hinata" />
				<Employee status="In shop" duration="00:55" name="Kageyama" />
				<Employee status="In shop" duration="00:45" name="Zoro" />
				<Employee status="Outside shop" duration="00:25" name="Nishinoya" />
			{/if}

		
	</section>
	<div class="card-footer"></div>
</div>
