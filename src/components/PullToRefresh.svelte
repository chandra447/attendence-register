<script>
    import { onMount, createEventDispatcher } from 'svelte';
    import { spring } from 'svelte/motion';
  
    export let onRefresh = () => Promise.resolve();
    let startY;
    let distance = 0;
    let isRefreshing = false;
    const threshold = 150;
    const dispatch = createEventDispatcher();
  
    const circleSpring = spring(0, {
      stiffness: 0.1,
      damping: 0.2
    });
  
    $: circleSpring.set(isRefreshing ? 1 : distance > threshold ? 1 : distance / threshold);
  
    function handleTouchStart(e) {
      if (isRefreshing) return;
      startY = e.touches[0].pageY;
      distance = 0;
    }
  
    function handleTouchMove(e) {
      if (isRefreshing) return;
      const y = e.touches[0].pageY;
      distance = y - startY;
      if (distance > 0 && window.scrollY === 0) {
        e.preventDefault();
      }
    }
  
    function handleTouchEnd() {
      if (isRefreshing) return;
      if (distance > threshold) {
        isRefreshing = true;
        onRefresh().then(() => {
          isRefreshing = false;
          distance = 0;
        });
        dispatch('refresh');
      }
      distance = 0;
    }
  
    onMount(() => {
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
  
      return () => {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    });
  </script>
  
  <div class="pull-indicator" style="height: {isRefreshing ? threshold : distance}px">
    <svg viewBox="0 0 100 100" width="40" height="40">
      <circle cx="50" cy="50" r="20" fill="none" stroke="#007AFF" stroke-width="4" stroke-dasharray="60 100">
        <animateTransform 
          attributeName="transform" 
          type="rotate"
          dur="1s" 
          from="0 50 50"
          to="360 50 50" 
          repeatCount="indefinite" />
      </circle>
      <circle cx="50" cy="50" r="10" fill="#007AFF" opacity={$circleSpring}>
        <animate 
          attributeName="r" 
          values="10;15;10" 
          dur="1s" 
          repeatCount="indefinite" />
      </circle>
    </svg>
    <span class="pull-text">
      {#if isRefreshing}
        Refreshing...
      {:else if distance > threshold}
        Release to refresh
      {:else if distance > 0}
        Pull down to refresh
      {/if}
    </span>
  </div>
  
  <style>
    .pull-indicator {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: rgba(240, 240, 240, 0.8);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      transition: height 0.2s;
    }
    .pull-text {
      margin-top: 10px;
      font-size: 14px;
      color: #007AFF;
    }
  </style>