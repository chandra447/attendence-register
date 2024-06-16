<script>
    import { getModalStore } from "@skeletonlabs/skeleton";
    import {getToastStore} from "@skeletonlabs/skeleton"
	import { triggerRefresh } from "../../stores/data";

	const toastStore = getToastStore();
	let background = 'variant-filled-success';
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

	function handleRefreshLedgers(){
		triggerRefresh.update( currentData=>{
			return {...currentData,ledgers: true};
		})
	}

    export let parent;

    const modalStore = getModalStore();

	let loading=false;

    //Form Data
    $: formData = {
        newLedger: '',
    }

async function createLedger(){
	const response = await fetch('/ledger',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		});
	return response;
}

async function deleteLedger(){
	const response = await fetch('/ledger',
		{
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: $modalStore[0]?.meta?.ledgerList[selectedLedgerIndex].id ?? '',
				name:$modalStore[0]?.meta?.ledgerList[selectedLedgerIndex].name ?? '',
			}),
		});
		return response;
}


async function handleSubmit() {
	loading = true;
	let response={ok:false,message:''};
	if ($modalStore[0].meta.operation==='create'){
		response =  await createLedger();
		if (response.ok) {
		triggertoast('Created ledger: '+formData.newLedger,'variant-filled-success')
		const data = await response.json();
		modalStore.close();
		
		}else{
		triggertoast('failed creating: '+formData.newLedger,'variant-filled-error')
		console.error('Error submitting form');
			}
		loading = false;
		return(response.ok);
	}
	if ($modalStore[0].meta.operation==='delete'){
		response = await deleteLedger();
	
		if (response.ok) {
		triggertoast('Deleted ledger: '+$modalStore[0]?.meta?.ledgerList[selectedLedgerIndex].name ?? '','variant-filled-success')
		const data = await response.json();
		modalStore.close();
		
		}else{
		triggertoast("Deletion failed",'variant-filled-error')
		console.error('failed deleting the ledger');
			}
		loading = false;
		return(response.ok);
	}
	
}

async function onFormSubmit(){
	if ($modalStore[0].response) $modalStore[0].response(formData);
	await handleSubmit();
	handleRefreshLedgers();
}

// Base Classes
const cBase = 'card p-4 w-modal-slim shadow-xl space-y-4';
const cHeader = 'text-2xl font-bold';
const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';

let selectedLedgerIndex = 0;

</script>


{#if $modalStore[0]}
	<div class="{cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<!-- Enable for debugging: -->
		<form class="modal-form {cForm}">
			<label class={'label ' + ($modalStore[0].meta.operation==='create'?'':'hidden')}>
				<span>Create New Ledger</span>
				<input class="input" type="text" name="ledger"  bind:value={formData.newLedger}/>
			</label>
			<label class={'label ' + ($modalStore[0].meta.operation==='delete'?'':'hidden')} >
				<span>Ledgers</span>
				<select class="select font-bold mt-2 variant-outline-primary input-group" bind:value={selectedLedgerIndex} size="1">
					{#each $modalStore[0].meta.ledgerList as item,index}
						<option value={index} selected={index === selectedLedgerIndex} >{item.name}</option>
					{/each}
				</select>
			</label>
		</form>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
			<button class="btn {parent.buttonPositive}" on:click={onFormSubmit} >
				{#if loading}
				Creating ...
				{:else}
				submit
				{/if}
			</button>
		
		</footer>
	</div>
{/if}