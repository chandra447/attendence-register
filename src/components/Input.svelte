<script>
	export let value = '';
	export let placeholder = '';
	export let id;
	export let label;
	export let type = 'text';
	export let disabled = false;
	export let required = false;
    export let bclass = 'input';

	export let errors;


</script>

<div class="form-control w-full max-w-lg mb-2">
	<label for={id} class="label pb-1">
		<span class="label-text">{label}</span>
	</label>
	<input
		class={bclass}
		{type}
		{placeholder}
		{required}
		{disabled}
		{id}
		name={id}
		{value}
	/>

	{#if errors}
		
		<label for={id} class="text-error-500 label mt-1">
			<span class="label">
				{errors[0]}

			</span>
		</label>
		
	{/if}
</div>
