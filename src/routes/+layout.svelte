<script>
	import '../app.postcss';
	import { initializeStores, Toast } from '@skeletonlabs/skeleton';
// 	import { computePosition, autoUpdate, offset, shift, flip,arrow } from '@floating-ui/dom';
//   import { storePopup } from '@skeletonlabs/skeleton';
//   storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	initializeStores();
	
</script>


<Toast />
<slot />
