
<script>
import { tableFilters } from "../stores/data";
export let inputEmployees;
export let filterSelected = 0;
// Add additional values 

inputEmployees = inputEmployees.map(employee => ({
        ...employee,
        present: false,
        disabledCheckin: true,
        disabledCheckout: true,
        transaction: 0
        }));
//apply the filters


$: filteredEmployees = (() => {
  switch (tableFilters[filterSelected]) {
    case 'All':
      return inputEmployees;
    case 'Absent':
      return inputEmployees.filter(x => !x.present);
    case 'Present':
      return inputEmployees.filter(x => x.present && !x.disabledCheckout);
    case 'Out-shop':
      return inputEmployees.filter(x => !x.disabledCheckin && x.present);
    default:
      return inputEmployees;
  }
})();
$: console.log(filteredEmployees)


</script>


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
			{#each filteredEmployees as row, index}
                <tr>
                    <td class="font-semibold">{row.Name}</td>
                    <td>
                    <label class="label">
                        <button class="btn btn-icon variant-filled-secondary h-8" 
                        disabled={row.transaction === 1} on:click={() => {
                            row.present = !row.present;
                            row.disabledCheckin = true;
                            row.disabledCheckout = false;
                            row.transaction = 1;
                           
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
                            
                         
                        }}>Check-in</button>
                        <button class="btn btn-sm variant-ghost-error" disabled={row.disabledCheckout}
                        on:click={() => {
                            row.disabledCheckout = true;
                            row.disabledCheckin = false;
                            
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






 