<script >


	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';
	import {getToastStore} from "@skeletonlabs/skeleton";
	import { createEventDispatcher } from 'svelte';
	import { triggerRefresh } from '../../stores/data';

	const dispatch = createEventDispatcher();
	
	function handleRefreshEmployees(){
		triggerRefresh.update( currentData=>{
			return {...currentData,employees: true};
		})
	}


	const toastStore = getToastStore();

	// Props
	/** Exposes parent props to this component. */
	export let parent;

	const modalStore = getModalStore();
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

	let loading = false;
	

	// Form Data
	$: formData = {
		username: '',
		password: '',
		isSupervisor: false,
		register: '',
	};
	async function handleSubmit() {
		loading = true;
	
		const response = await fetch('/onboard',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

		if (response.ok) {
			
			const data = await response.json();
			triggertoast('Created employee: '+formData.username,'variant-filled-success');
			handleRefreshEmployees();
			modalStore.close();
			loading=false;
			
		}else{
			const error = await response.json();
			// triggertoast('failed creating: '+formData.username,'variant-filled-error');
			triggertoast(error.message,'variant-filled-error');
			modalStore.close();
			loading=false;
		}
		return(response.ok);
		
	}

	// We've created a custom submit function to pass the response and close the modal.
<<<<<<< Updated upstream
	function onFormSubmit(): void {
		if ($modalStore[0].response) {
			formData['register'] = $modalStore[0]? $modalStore[0].meta.currentCollection.id : '';
			handleSubmit();
			$modalStore[0].response(formData);
	}
=======
	function onFormSubmit() {
		if ($modalStore[0].response) $modalStore[0].response(formData);
		handleSubmit();
>>>>>>> Stashed changes
		
		}
	

	// Base Classes
	const cBase = 'card p-4 w-modal-slim shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';

	$: isValidPin = formData.password.length === 5;
<<<<<<< Updated upstream
	function togglepin(){
		
		formData.isSupervisor = !formData.isSupervisor;
		
	}
=======
>>>>>>> Stashed changes
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="{cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>For register <b class="text-violet-600 text-pretty">{$modalStore[0].meta.currentCollection.name}</b></article>
		<!-- Enable for debugging: -->
		<div class="modal-form {cForm}">
			<label class="label">
				<span>Employee</span>
				<input class="input" type="text" name="employee" bind:value={formData.username} placeholder="Enter name..." />
			</label>

			<label class="label space-x-1">
				<span class="badge variant-filled-surface text-base">SuperVisor?</span>
				<button class={'btn btn-icon ' + (formData.isSupervisor? 'variant-filled-primary' : 'variant-filled-secondary')}  on:click={togglepin} >
					{#if formData.isSupervisor}
					✅
					{:else}
					<i class="fa-solid fa-x"></i>
					{/if}
				</button>
				

			</label>

			<label class={'label ' + (formData.isSupervisor? 'block' : 'hidden')}>
				<span>Pin (5 digits)</span>
				<input class={'input ' + (isValidPin ? 'input-success ': 'input-error ') }
						type="text" name="pin" bind:value={formData.password} placeholder="Enter pin..." maxlength="5" />
			</label>
			
		</div>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
			<button class="btn {parent.buttonPositive}" on:click={onFormSubmit} >
				{#if loading}
				Creating...
				{:else}
				Create Employee
				{/if}
			</button>
		</footer>
	</div>
{/if}