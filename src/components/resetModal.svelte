<script>
	import { createEventDispatcher } from 'svelte';
	import { portal } from 'svelte-portal';
	
	export let showModal = false;
    export let row;
	export let resetModalFn;
	export let checkoutFn;
    export let currentView = 'md';
 
	let dialog;
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
        event.stopPropagation();
        
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
    <div use:portal>
        <div class="modal-backdrop" on:click={handleClose} on:keydown={(e) => e.key === 'Enter' && handleClose()} tabindex="0" role="button" aria-label="Close modal"></div>
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
                        <button type="button" class="btn rounded-md variant-filled-secondary text-lg" id="reset-{row.id}" 
                            on:click={(e) => handleSubmit(e, 'reset')}>Reset 🛠️</button>
                        <button type="submit" class="btn rounded-md variant-filled-error text-lg" id="checkout-{row.id}">Check out</button>
                    </div>
                </form>
                <button type="button" class="close-button" aria-label="Close modal" on:click={handleClose}>&times;</button>
            </div>
        </dialog>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
        cursor: pointer;
    }

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


</style>