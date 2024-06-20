
<script>
  import { createFilterStore, filterHandler } from "$lib/stores/filter";
  import { onDestroy } from "svelte";
  import {RadioGroup, RadioItem} from '@skeletonlabs/skeleton';
import { tableFilters } from "../stores/data";
export let inputEmployees;

// Add additional values 

inputEmployees = inputEmployees.map(employee => ({
        ...employee,
        present: false,
        disabledCheckin: true,
        disabledCheckout: true,
        transaction: 0
        }));



const filterStore = createFilterStore(inputEmployees);

const unsubscribe = filterStore.subscribe((model)=>{
  filterHandler(model);
      }
      );




onDestroy(()=>{
  unsubscribe();
})

const handlePresent=(id)=>{
  //update the emplopyee object
  const emp = $filterStore.filtered.find(x=> x.id===id);
  if (emp) {
    emp.present = !emp.present;
    emp.disabledCheckin = true;
    emp.disabledCheckout = false;
    emp.transaction = 1;
    $filterStore.trigger = true;
  }

}


</script>

<div class="flex flex-row">
 

  <div>
    <RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary" gap='gap-2'>
      {#each tableFilters as filter, index}
        <RadioItem bind:group={$filterStore.filter} name="All" value={index}>{filter}</RadioItem>
    
      {/each}
    </RadioGroup>
  </div>
</div>

<!-- Responsive Container (recommended) -->
<div class="table-container border-2 border-slate-600">
	<!-- Native Table Element -->
	<table class="table table-hover">
		<thead>
			<tr>
				<th>Name</th>
				<th>Present?</th>
				<th>Options</th>
			</tr>
		</thead>
		<tbody>
			{#each $filterStore.filtered as row, index}
                <tr>
                    <td class="font-semibold">{row.Name}</td>
                    <td>
                    <label class="label">
                        <button class="btn btn-icon variant-filled-secondary h-8" 
                        disabled={row.transaction === 1} on:click={() => {
                            handlePresent(row.id);
                        }}>
                        {#if row.present}
                            ✅
                        {:else}
                            ❌
                        {/if} 
                        </button>
                    </label>
                    </td>
                    <td>
                    <div class="flex flex-row space-x-2">
                        <button class="btn btn-sm variant-filled-success" disabled={row.disabledCheckin}
                        on:click={() => {
                            row.disabledCheckout = false;
                            row.disabledCheckin = true;
                            $filterStore.trigger = true;
                            
                         
                        }}>Check-in</button>
                        <button class="btn btn-sm variant-ghost-error" disabled={row.disabledCheckout}
                        on:click={() => {
                            row.disabledCheckout = true;
                            row.disabledCheckin = false;
                            $filterStore.trigger = true;
                            
                        }}>Check out</button>
                    </div>
                    </td>
                </tr>
                {/each}
		</tbody>
		<tfoot>
			
		</tfoot>
	</table>
</div>






 