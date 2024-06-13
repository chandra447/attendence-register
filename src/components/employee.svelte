<script>
    import { SlideToggle } from "@skeletonlabs/skeleton";
    export let status;
    export let name;
    export let duration;
</script>
    <div class="list grid grid-cols-4 md:grid-cols-3 grid-rows-2 md:grid-rows-1 rounded-md shadow-md bg-slate-300
                px-5 py-3  shadow-slate-500 grid-flow-col ">
        <p class="col-span-2 md:col-span-1 md:font-semibold col-start-1 order-first">{name}
                <span class={"badge "+(status==='In shop' ? 'variant-filled-success' : 'variant-filled-error')}>
                    {status}</span></p>
        
        <div class="col-span-2 md:col-span-1 order-2 col-start-3 md:col-start-2 mx-auto">
            <span>
            <SlideToggle name="Present?" size="sm"  active="bg-primary-500">Present?
                <p class="font-sans font-semibold tracking-wider inline-block ">{duration}</p>
            </SlideToggle>
            
        </span>

        </div>
        
        <div class=" order-3 flex flex-row space-x-3 mx-auto md:col-start-3 col-span-4 md:col-span-1">
            <button class="btn  variant-ghost-primary text-xs ">Check In</button>
            <button class="btn  variant-ghost-error text-xs  ">Check out</button>
        </div>
    </div>
							
		