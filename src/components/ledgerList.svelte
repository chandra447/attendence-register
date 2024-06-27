<script>
    let ledgers = ['Main Road','Department Stores','Once piece','Kaiju no 8']
    let selectedLedger = 0;
</script>

<label class="label">
	
	<select class="select font-bold mt-2 variant-outline-primary input-group" size="1"
    bind:value={selectedLedger} >
        {#each ledgers as item,index}
       
		<option value={index} selected={index===0}>{item}</option>
        {/each}
	</select>
    <span>{ledgers[selectedLedger]}</span>
</label>