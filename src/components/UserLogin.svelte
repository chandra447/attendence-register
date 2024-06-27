<script>
    export let isAdmin;
    import {enhance} from "$app/forms"
  import {getToastStore} from "@skeletonlabs/skeleton"
  import Input from "./Input.svelte";
  import Spinner from "./spinner.svelte";

  const toastStore = getToastStore();
  let loading = false;
    export let formData;

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

  const handleUserLogin = () => {
    loading=true;
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

<form action="?/userLogin" method="post" class="space-y-2" use:enhance={handleUserLogin}>
    <input type="hidden" name="isAdmin" value={isAdmin}/>
        <Input bclass="input px-10 md:px-3 " type="text" placeholder="username.." id="username" disabled={loading} label='User name'
        errors={formData?.errors?.username} value={formData?.data?.username ?? ''}/>
     

         <Input bclass="input px-10 md:px-5" type="password" placeholder="pin.." id="password" disabled={loading} label='Enter Pin'
        errors={formData?.errors?.password}/>
       

    <button type="submit" class="order-1 m-3 btn btn-md variant-filled-primary group-hover:-translate-y-0.225 duration-200">
        {#if loading} <span>Loading... </span>
            <Spinner/>
            {:else}
            
            <span>Login &rarr;</span>
            {/if}
    </button>
</form>