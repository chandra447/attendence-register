<script>
  import moment from "moment-timezone";

    export let startTime ;
    export let setid = '';
    let isRunning=false;
    let initaldifference = Math.abs(moment(startTime).diff(moment(),"millisecond").valueOf());
    let displayContent = calculateString(initaldifference)

    function calculateString(milliTime){
  
        let hours = Math.floor(milliTime/(1000 * 60*60));
        let minutes =Math.floor(milliTime/ (1000*60)%60);
        let seconds = Math.floor(milliTime/1000%60);
        let milliseconds = Math.floor(milliTime/1000 /10);

        let shours = String(hours).padStart(2,"0");
        let sminutes = String(minutes).padStart(2,"0");
        let sseconds = String(seconds).padStart(2,"0");


        return `${shours}:${sminutes}:${sseconds}`

    }

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