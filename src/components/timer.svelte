<script>
  import moment from "moment-timezone";
  import { calculateString } from "$lib/utils";

    export let startTime ;
    export let setid = '';
    let isRunning=false;
    let initaldifference = Math.abs(moment(startTime).diff(moment(),"millisecond").valueOf());
    let displayContent = calculateString(initaldifference)

    
    function update(){
        const currentTime = Date.now();
        let elapsedTime = Math.abs(moment(startTime).diff(moment(),"millisecond").valueOf());

        displayContent = calculateString(elapsedTime)


    }
    setInterval(update,1000);
</script>

<div id={'dispaly'+setid}>
    {displayContent}
</div>