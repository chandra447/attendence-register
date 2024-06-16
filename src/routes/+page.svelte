<script>
  import { SlideToggle } from "@skeletonlabs/skeleton";
  import AdminLogin from "../components/adminLogin.svelte";
  import Register from "../components/register.svelte";
  import UserLogin from "../components/UserLogin.svelte";
  import { registerActive } from "../stores/data";

export let form;
  
  let isAdmin = false;
  let register = false;
  registerActive.subscribe(value=>{
    register=value;
  })
  function handleToggle(){
    isAdmin = !isAdmin;
  
  }

</script>


<div class=" mx-auto h-dvh p-10 md:p-20 items-center justify-center flex">
    <div class="flex flex-row items-center justify-center mx-auto card">
   <div class="w-full md:w-1/2 flex flex-col space-y-4 p-12 md:p-10">
        <h1 class="h1 mx-auto mb-6  ">
            <span class="bg-gradient-to-br from-blue-500 to-cyan-300 bg-clip-text text-transparent box-decoration-clone tracking-wide ">Dk Stores</span>
        </h1>
        <!-- Create the switch between user and admin logins -->
         <span class="mx-auto">
            <SlideToggle name="userAdminSwitch" active="bg-primary-500" size="sm" on:change={handleToggle}>
                <span class="text-primary-500 font-semibold tracking-wide">Admin?</span>
            </SlideToggle>
            
        </span>
        <h2 class="h2 items underline text-slate-600">{register ? 'Register' : 'Login'}</h2>
        
        
        {#if !register}
            {#if isAdmin}
             
                <AdminLogin isAdmin={isAdmin} formData={form} />
            {:else} <UserLogin isAdmin={isAdmin} formData={form}/>
            {/if}
        {:else}
        
            <Register formData={form} />
        {/if}

    </div> 


   <!-- logo design -->
    <div class="w-1/2 md:block hidden mx-auto">
        <div class="flex flex-col items-center space-y-0">
                <img src="assets/logo_transparent.png" alt="shop Logo" 
                class="rounded-md scale-50 inline-block h-120 w-[480px] h-[420px] "/>
        </div>
    </div>
</div>
</div>