<script>
    import { getModalStore } from "@skeletonlabs/skeleton";
    import {getToastStore} from "@skeletonlabs/skeleton"

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

    export let parent;

    const modalStore = getModalStore();

	let loading=false;

    //Form Data
    $: formData = {
        newLedger: '',
    }


async function handleSubmit() {
	loading = true;
	const response = await fetch('/ledger',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		});
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

async function onFormSubmit(){
	if ($modalStore[0].response) $modalStore[0].response(formData);
	await handleSubmit();
	location.reload()
}

// Base Classes
const cBase = 'card p-4 w-modal-slim shadow-xl space-y-4';
const cHeader = 'text-2xl font-bold';
const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>


{#if $modalStore[0]}
	<div class="{cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<!-- Enable for debugging: -->
		<form class="modal-form {cForm}">
			<label class="label">
				<span>Create New Ledger</span>
				<input class="input" type="text" name="ledger"  bind:value={formData.newLedger}/>
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