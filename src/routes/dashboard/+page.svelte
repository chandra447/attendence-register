<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->
<script>
import { RadioGroup, RadioItem, getModalStore,SlideToggle } from '@skeletonlabs/skeleton';
import {employeeObject, ledgersMap,generateEmployees} from '../../lib/utils.js'
import Employee from "../../components/employee.svelte";

	export let data;


	const modalStore = getModalStore();

function modalComponentForm() {
		const modal = {
			type: 'component',
			component: 'modelComponentOne',
			title: 'Create Employee',
			response: (/** @type {any} */ r) => console.log('response:', r)
		};
		// @ts-ignore
		modalStore.trigger(modal);
	};
	let ledgers = ['Main Road','Department Stores'];
	function addLedgeritem(item){
		console.log(ledgers)
		console.log('Adding to the array',item)
		// ledgers = [item.newLedger,...ledger]
		ledgers = [...ledgers,item.newLedger]
		console.log(ledgers)
	}
	function modalLedger() {
		const modal = {
			type: 'component',
			component: 'createLedgerComponent',
			title: 'make Supervisor',
			response: (/** @type {any} */ r) => addLedgeritem( r)
		};
		// @ts-ignore
		modalStore.trigger(modal);
	}

	let selectedLedgerindex = 0;
	let selectedLedger = ledgers[selectedLedgerindex];
	


	function getLedgers() {
    return Object.keys(employeeObject);
  }

  function getEmployees(){
	return ledgersMap.get(selectedLedger)?.employees;
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
			<RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary">
				{#each ledgers as item,index }

				<RadioItem bind:group={selectedLedgerindex} name='ledgerDisplay' value={index} selected>{item}</RadioItem>
				{/each}
				
			</RadioGroup>

			<!-- Input for new ledger -->
			 <button class={'btn btn-sm variant-ghost-primary mt-2 md:mt-0 '+
							(data.user.isAdmin? '': 'hidden')} on:click={modalLedger}>New Ledger ✚</button>
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
