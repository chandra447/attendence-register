<script>
    import { getModalStore } from "@skeletonlabs/skeleton";
    import {getToastStore} from "@skeletonlabs/skeleton"
    import moment from "moment-timezone";
    import { triggerRefreshTime } from "../../stores/data";
    function convertTimeToUTCTimestamp(timeString) {
  // Get current date
  const nowm = moment().tz('Asia/Kolkata');
  // Split the time string into hours and minutes
  const [hours, minutes] = timeString.split(':').map(Number);
  // Set the time on today's date
  nowm.hours(hours).minutes(minutes).seconds(0).milliseconds(0);
  // Convert to UTC
  const utcMoment = nowm.clone().tz('UTC');
  return utcMoment;
}
function handleRefreshTime(){
		triggerRefreshTime.update((n)=>!n)
	}
	const toastStore = getToastStore();
	let background = 'variant-filled-success';
	const triggertoast=(/** @type {string} */ tmessage, background)=>{
        let t = {
        message: tmessage,
        timeout:10000,
        background: background,
        padding:'p-6',
        hoverable: true
    };
	toastStore.trigger(t);
    }


    export let parent;

    const modalStore = getModalStore();

	let loading=false;

    //Form Data
    $: formData = {
        startDateTime: '',

    }

async function createStart(data){
	const response = await fetch('/startDay',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
	return response;
}


async function handleSubmit() {
	loading = true;
  
	let response={ok:false,message:''};
    let data = {register:$modalStore[0]? $modalStore[0].meta.currentCollection.id:'',
                StartDateTime:convertTimeToUTCTimestamp(formData.startDateTime).format('YYYY-MM-DD HH:mm:ss').replace("T"," ")}
    response = await createStart(data)

		if (response.ok) {
		triggertoast('Setting start to : '+formData.startDateTime,'variant-filled-success')
		const data = await response.json();
         handleRefreshTime();
		modalStore.close();
        
		
		}else{
		triggertoast('failed creating: '+formData.startDateTime,'variant-filled-error')
		console.error('Error submitting form');
			}
		loading = false;
		return(response.ok);
	
}

async function onFormSubmit(){
	if ($modalStore[0].response) $modalStore[0].response(formData);
	await handleSubmit();
	
}

// Base Classes
const cBase = 'card p-4 w-modal-slim shadow-xl space-y-4';
// const cBase = 'bg-surface-100-800-token w-screen h-screen p-4 flex-row  items-center ';
const cHeader = 'text-2xl font-bold';
const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';

let selectedLedgerIndex = 0;

</script>


{#if $modalStore[0]}

        <div class="{cBase}">
            
            <!-- Enable for debugging: -->
            <form class="modal-form   {cForm}">
                <h4>Select Start Time 🕰️</h4>
                <label class={'label '}>
                    
                    <input class="input" type="time" name="ledger"  bind:value={formData.startDateTime}/>
                </label>
                
            </form>
            <!-- prettier-ignore -->
            <footer class="items-center justify-self-center {parent.regionFooter}">
                <!-- <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button> -->
                <button class="btn {parent.buttonPositive}" on:click={onFormSubmit} on:click={parent.onClose} >
                    {#if loading}
                    Creating ...
                    {:else}
                    Start 📆
                    {/if}
                </button>
            
            </footer>
            
      
	</div>
{/if}