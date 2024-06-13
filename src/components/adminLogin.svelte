<script>
  import { createEventDispatcher } from "svelte";
  import { getToastStore } from "@skeletonlabs/skeleton";
  import { enhance } from "$app/forms";
  import Spinner from "./spinner.svelte";

  import Input from "./Input.svelte";

    export let formData;
   const toastStore = getToastStore();
    export let isAdmin;
    const dispatch = createEventDispatcher();

    function handleRegisterDispatch(){
        dispatch('registered',{value:true})
    }
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
 
    <Input bclass="input px-10 md:px-5" type="email" placeholder="Enter Email" disabled={loading}
            label="Email" errors={formData?.errors.email} id="email"/>

    <Input bclass="input px-10 md:px-5" type="password" placeholder="Enter Password.." disabled={loading}
            errors={formData?.errors?.password} id="password" label="Password"/>

    <label class="label mt-1" for="forgot">Forgot 
        <a href="/" class="font-light hover:text-violet-400 hover:font-semibold">Password?</a>
    </label>
    <div class="grid grid-cols-2 w-full">
        <button type="submit" class="order-1 m-3 btn btn-md variant-filled-primary group-hover:-translate-y-0.225 duration-200">
          
            {#if loading} <span>Loading... </span>
            <Spinner/>
            {:else}
            
            <span>Login &rarr;</span>
            {/if}
            
        </button>
        <button type="button" 
        class="order-2 btn m-3 btn-md variant-ghost-warning group-hover:-translate-y-0.225 duration-200"
                on:click={handleRegisterDispatch}>
            <span>Signup</span>
        </button>
    </div>
   

</form>