<script>
	export let showModal; // boolean
    export let onUpdate; // function to call when updating
    export let onClose;
	

	let dialog; // HTMLDialogElement

	$: if (dialog && showModal) dialog.showModal();

    function handleClose() {
    showModal = false;
    onClose(); // Call the onClose function prop
  }

    function handleSubmit(event) {
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    onUpdate(data);
  }
    
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog 
bind:this={dialog} 
on:close={handleClose}
on:click|self={handleClose}
class="w-[90%] m-auto"
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation >
		<slot name="header" />
		<hr />
		<form on:submit|preventDefault={handleSubmit}>
            <slot />
           <div class="grid grid-cols-2">
                <button type="submit" class="btn px-3 py-2 variant-filled-secondary text-xs overflow-hidden mt-2 rounded-md">
                Update Details ✓
                </button>
                <button class="btn rounded-xl variant-filled-error text-lg mt-2 hover:font-semibold justify-self-end " on:click={() => dialog.close()} >
                    x
                </button>
        </div>
          </form>
        
	</div>
</dialog>

<style>
	dialog {
		max-width: 32em;
		border-radius: 0.2em;
		border: none;
		padding: 0;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	
</style>
