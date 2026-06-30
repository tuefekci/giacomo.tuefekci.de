<script>
	import { page } from '$app/stores';
</script>


<div class="pt-12">

	<div class="flex pb-4">
		<h2 class="text-4xl">{$page.status}: {$page.error.message}</h2>
		<div class="flex grow h-1 mt-5 ml-3 gradient-background-line"></div>
	</div>

	<div class="lg:grid grid-cols-12 md:gap-10 pt-4 items-center">
	  <div class="col-span-12 space-y-2.5">
		<div class="">
		  <p class="text-gray-lite dark:text-white/60 leading-7">
			Lost in Cyberspace! The page you're looking for seems to have taken a tea break, and we can't blame it; we all need one from time to time.
		  </p>
  
		</div>
	  </div>
	</div>
	
</div>	