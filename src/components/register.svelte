<script>
    import { createEventDispatcher } from "svelte";
    import {getToastStore} from "@skeletonlabs/skeleton"
    import { enhance } from "$app/forms";
    import Input from "./Input.svelte";
    import Spinner from "./spinner.svelte";
    export let formData;
    let loading=false;
    const toastStore = getToastStore();
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
    const submitRegistration = () => {
        return async({result,update})=>{
            loading = true;
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
            };
            loading=false;
        };
    };

    let password = '';
    let confirmpassword = '';
    let passwordMatch = false;

    
    function validatePasswords(){
        passwordMatch = password === confirmpassword;
    }
    const dispatch = createEventDispatcher();
    function handleRegisterDispatch(){
        dispatch('registered',{value:false})
    }
</script>
<form action="?/register" method="post" class="space-y-2" use:enhance={submitRegistration} use:enhance={submitRegistration}>
    <button type="button"  class="btn btn-sm variant-outline-secondary hover:variant-filled-secondary
                    hover:text-white font-semibold" on:click={handleRegisterDispatch} >&larr;</button>

    <Input bclass="input px-10 md:px-5 py-2" type="text" placeholder="Name" id="name" errors={formData?.errors?.name}
        disabled={loading} value={formData?.data?.name ?? ''} label='Name'/>

    <Input bclass="input px-10 md:px-5 py-2" type="email" placeholder="Enter Email" id="email" errors={formData?.errors?.email}
            disabled={loading} value={formData?.data?.email ?? '' } label="email"/>

    <Input bclass="input px-10 md:px-5 py-2" type="password" id="password" placeholder="Enter Password" errors={formData?.errors?.password}
            disabled = {loading} label="Password"/>
  
    <Input bclass="input px-10 md:px-5 py-2" id="passwordConfirm" placeholder="Confirm Password" errors={formData?.errors?.passwordConfirm}
            disabled={loading} label="passwordConfirm"/>

    <button type="submit" class="order-1 m-3 btn btn-md variant-filled-primary group-hover:-translate-y-0.225 duration-200">
        {#if loading} <span>Loading... </span>
        <Spinner/>
        {:else}
        
        <span>Submit</span>
        {/if}
    </button>
</form>