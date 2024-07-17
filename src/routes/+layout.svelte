<script>
	import '../app.postcss';
	import { initializeStores, Toast, Drawer } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip,arrow } from '@floating-ui/dom';
  import { storePopup } from '@skeletonlabs/skeleton';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import PullToRefresh from '../components/PullToRefresh.svelte';
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	initializeStores();

	let isStandalone = false;
	onMount(() => {
    if (browser) {
      isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    }
  });

  function handleRefresh() {
    location.reload();
  }
	
</script>


<Toast />
<Drawer zIndex = "z-[1100]"/>
{#if isStandalone}
  <PullToRefresh onRefresh={handleRefresh} />
{/if}
<slot />
