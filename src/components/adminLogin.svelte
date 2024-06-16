<script>
  import { getToastStore } from "@skeletonlabs/skeleton";
  import { enhance } from "$app/forms";
  import Spinner from "./spinner.svelte";
  import { registerActive } from "../stores/data";

  import Input from "./Input.svelte";

    export let formData;
   const toastStore = getToastStore();
    export let isAdmin;

    function handleRegisterStore(){
        registerActive.set(true);
    };
    let loading = false;
  
    const triggertoast=(/** @type {string} */ tmessage)=>{
        let t = {
        message: tmessage,
        timeout:10000,
        background: 'variant-filled-error',
        padding:'p-6',
        hoverable: true       
    };

    toastStore.trigger(t);
    }

    const submitLogin = () => {
        loading = true;
        return async({result,update})=>{
            switch (result.type){
                case 'success':
                    await update();
                    break;
                case 'failure':
                    triggertoast('Invalid credentials');
                    await update();
                    break;
                case 'error':
                 triggertoast('Login Failed');
                    break;
                default:
                    await update();
            }
        loading=false;
        };
    };

</script>

<form action="?/login" method="post" class="space-y-2" use:enhance={submitLogin} >
    <input type="hidden" name="isAdmin" value={isAdmin}/>
 
    <Input bclass="input px-6 md:px-5 text-xs md:text-lg placeholder:text-xs md:placeholder:text-md" type="email" placeholder="Enter Email" disabled={loading}
            label="Email" errors={formData?.errors.email} id="email"/>

    <Input bclass="input px-6 md:px-5 text-xs md:text-lg placeholder:text-xs md:placeholder:text-md" type="password" placeholder="Enter Password.." disabled={loading}
            errors={formData?.errors?.password} id="password" label="Password"/>

    <label class="label mt-1" for="forgot">Forgot 
        <a href="/" class="font-light hover:text-violet-400 hover:font-semibold">Password?</a>
    </label>
    <div class="grid grid-cols-2 w-full">
        <button type="submit" class="order-1 m-3 btn btn-lg md:btn-md variant-filled-primary group-hover:-translate-y-0.225 duration-200">
          
            {#if loading} <span class="font-semibold text-xs md:text-lg md:font-normal">Loading... </span>
            <Spinner/>
            {:else}
            
            <span class="font-semibold text-xs md:text-lg md:font-normal">Login &rarr;</span>
            {/if}
            
        </button>
        <button type="button" 
        class="order-2 btn m-3 btn-lg md:btn-md variant-ghost-warning group-hover:-translate-y-0.225 duration-200"
                on:click={handleRegisterStore}>
            <span class="font-semibold text-xs md:text-lg md:font-normal">Signup</span>
        </button>
    </div>
   

</form>