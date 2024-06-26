<script>
	import {AppBar, Avatar, Modal, initializeStores,Toast} from '@skeletonlabs/skeleton';
	import CreateUser from '../../lib/modals/UserOnboard.svelte'
  import LedgerCreator from '$lib/modals/LedgerCreator.svelte';


	initializeStores();

	const modalRegistry = {
		CreateUser: {ref:CreateUser},
		createLedgerComponent: {ref:LedgerCreator},
	};
	 
	
</script>
<div class=" h-screen ">
<AppBar>
	<svelte:fragment slot="lead">
		<div class="flex flex-row items-center space-x-1">
			<Avatar src="assets/logo_transparent.png" width="w-16" rounded="rounded-md" background="transparent"/>
			<h1 class="h2 md:h1">
				<span class="bg-gradient-to-br from-blue-500 to-cyan-300 bg-clip-text text-transparent box-decoration-clone">Dk Stores</span>
			</h1>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<form action="/logout" method="post">
			<button type="submit" class="btn btn-md md:btn-lg variant-filled-primary
								hover:variant-outline-warning font-semibold">Logout &rarr;</button>
		</form>
	</svelte:fragment>
</AppBar>

<Modal components={modalRegistry}/>

<Toast zIndex="z-[1400]"/>


<slot />

</div>
