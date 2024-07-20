<script>
	import { createEventDispatcher } from 'svelte';
	
	export let showModal = false;
    export let row;
	export let resetModalFn;
	export let checkoutFn;
    export let currentView = 'md'; // New prop to determine current view
 
	let dialog; // HTMLDialogElement
	const dispatch = createEventDispatcher();

	$: if (dialog && showModal) dialog.showModal();

    function handleClose() {
        showModal = false;
        dialog.close();
		dispatch('close');
    }

    function handleKeydown(event) {
        if (event.key === 'Escape') {
            handleClose();
        }
    }

    function handleSubmit(event, action) {
        event.preventDefault();
        
        if (action === 'reset') {
            resetModalFn();
        } else if (action === 'checkout') {
            checkoutFn();
        }
        
        handleClose();
    }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if showModal}
    <dialog 
        bind:this={dialog} 
        on:close={handleClose}
        class="modal rounded-md shadow-md shadow-red-400 p-3 {currentView}"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
    >
        <div class="modal-content">
            <h2 id="modal-title"><slot name="header" /></h2>
            
            <form on:submit|preventDefault={(e) => handleSubmit(e, 'checkout')}>
                <div id="modal-description">
                    <slot />
                </div>
                <div class="grid grid-cols-2 gap-2 mt-3">
                    <button type="button" class="btn rounded-md variant-filled-secondary text-lg" id="reset-{currentView}-{row.id}" 
                        on:click={(e) => handleSubmit(e, 'reset')}>Reset 🛠️</button>
                    <button type="submit" class="btn rounded-md variant-filled-error text-lg" id="checkout-{currentView}-{row.id}"
                    >Check out</button>
                </div>
            </form>
            <button type="button" class="close-button" aria-label="Close modal" on:click={handleClose}>&times;</button>
        </div>
    </dialog>
{/if}

<style>
	.modal {
		border: none;
		padding: 0;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 32em;
        max-height: 90vh;
        overflow-y: auto;
        z-index: 1000;
	}

	.modal-content {
		padding: 1em;
		position: relative;
	}

	.close-button {
		position: absolute;
		top: 0.5em;
		right: 0.5em;
		background: none;
		border: none;
		font-size: 1.5em;
		cursor: pointer;
	}

	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes zoom {
		from {
			transform: translate(-50%, -50%) scale(0.95);
		}
		to {
			transform: translate(-50%, -50%) scale(1);
		}
	}

    /* You can add specific styles for md and mobile views if needed */
    .modal.md {
        /* Styles for md view */
    }

    .modal.mobile {
        /* Styles for mobile view */
    }
</style>