<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	const modalStore = getModalStore();
	

	// Form Data
	$: formData = {
		username: '',
		password: '',
		isSupervisor: false,
	};
	async function handleSubmit() {
		console.log('called function handleSumbit')
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
			console.log('Employee created successfully:', data);
			modalStore.close();
			
		}else{
			console.error('Error submitting form');
		}
		return(response.ok);
		
	}

	// We've created a custom submit function to pass the response and close the modal.
	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response(formData);
		handleSubmit();
		
		}
	

	// Base Classes
	const cBase = 'card p-4 w-modal-slim shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';

	$: isValidPin = formData.password.length === 5;
	$: console.log(isValidPin)
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="{cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<!-- Enable for debugging: -->
		<div class="modal-form {cForm}">
			<label class="label">
				<span>Employee</span>
				<input class="input" type="text" name="employee" bind:value={formData.username} placeholder="Enter name..." />
			</label>

			<label class="label space-x-1">
				<input class="checkbox" type="checkbox" name="isSupervisor" bind:value={formData.isSupervisor}/>
				<span class="badge variant-filled-surface">SuperVisor?</span>

			</label>

			<label class="label">
				<span>Pin (5 digits)</span>
				<input class={'input ' + (isValidPin ? 'input-success ': 'input-error ')
								+(!formData.isSupervisor? 'hidden' : '') }
						type="text" name="pin" bind:value={formData.password} placeholder="Enter pin..." maxlength="5" />
			</label>
			
		</div>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
			<button class="btn {parent.buttonPositive}" on:click={onFormSubmit} >Create Employee</button>
		</footer>
	</div>
{/if}