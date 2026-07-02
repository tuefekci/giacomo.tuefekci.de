<script>
	/** @type {import('./$types').PageData} */
	export let data;
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { onMount, onDestroy } from 'svelte';
	import { theme } from '$lib/store';
	const resume = data.props.resume;
	const age = new Date().getFullYear() - parseInt(resume.basics.birth.date);

	import MenuItem from '$lib/components/menuItem.svelte';
	import PageTransition from './transition.svelte'
	import PrintDocument from '$lib/components/PrintDocument.svelte'

	let showBackToTop = false;
	function handleScroll() {
		showBackToTop = window.scrollY > window.innerHeight;
	}
	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
	onMount(() => {
		theme.init();
		window.addEventListener('scroll', handleScroll);
	});
	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('scroll', handleScroll);
		}
	});

	//<MenuItem path="blog">Blog</MenuItem>

	const personSchema = JSON.stringify({
		"@context": "https://schema.org",
		"@type": "Person",
		"name": resume.basics.name,
		"jobTitle": resume.basics.label,
		"email": resume.basics.email,
		"url": resume.basics.url,
		"image": resume.basics.image,
		"address": { "@type": "PostalAddress", "addressLocality": resume.basics.location.city, "addressCountry": resume.basics.location.countryCode },
		"birthDate": "1991-01-01",
		"knowsLanguage": resume.languages.map(l => ({ "@type": "Language", "name": l.language })),
		"knowsAbout": [...new Set(resume.skills.flatMap(s => s.keywords || []))],
		"description": resume.basics.summary
	});

	const ldJsonScript = '<script type="application/ld+json">' + personSchema + '<' + '/script>';
</script>

<svelte:head>
	{@html ldJsonScript}
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={resume.basics.name + ' - Portfolio'} />
	<meta name="twitter:description" content={resume.basics.summary} />
	<meta name="twitter:image" content={resume.basics.image} />
</svelte:head>



<div class="min-h-screen dark:text-white w-full h-full gradient-background print:bg-transparent print:text-black">

	<div class="fixed top-0 left-0 right-0 z-50 lg:hidden bg-white dark:bg-[#111111] shadow-md border-b border-[#E3E3E3] dark:border-[#3D3A3A] print:hidden">
		<div class="flex items-start gap-3 px-5 pt-4 pb-2.5 max-[375px]:px-4 max-[375px]:pt-3 max-[375px]:pb-2">
			<img src="{resume.basics.image}"
				alt="Portrait of {resume.basics.name}"
				class="w-14 h-14 rounded-lg object-cover flex-shrink-0 max-[375px]:w-12 max-[375px]:h-12"
			/>
			<div class="min-w-0 flex-1">
				<div class="flex items-baseline gap-1.5 flex-wrap">
					<span class="font-semibold text-base dark:text-white truncate max-[375px]:text-sm">{resume.basics.name}</span>
					<span class="text-sm text-[#7B7B7B] truncate max-[375px]:text-xs">· {resume.basics.label}</span>
				</div>
			<div class="w-full text-[10px] text-[#7B7B7B] mt-0.5 leading-tight flex flex-wrap gap-x-2">
				<span>Born {resume.basics.birth.date}, {resume.basics.birth.city}</span>
				<span>{#each resume.languages as lang, i}{i > 0 ? "· " : ""}{lang.language} ({lang.fluency}){/each}</span>
			</div>
			<div class="w-full text-[10px] text-[#7B7B7B] leading-tight flex flex-wrap gap-x-2">
				<span>{resume.basics.email}</span>
				<span>Based in {resume.basics.location.city}</span>
			</div>
			</div>
		</div>
		<div class="flex border-t border-[#E3E3E3] dark:border-[#3D3A3A]">
			{#each [{p:"", label:"About"},{p:"resume", label:"Resume"},{p:"portfolio", label:"Works"}] as item}
				{@const active = $page.url.pathname.replace(/\/$/, '') === (base + '/' + item.p).replace(/\/$/, '')}
				<a href="{base}/{item.p}"
					class="flex-1 text-center pt-3.5 pb-5 text-sm font-medium transition-colors relative max-[375px]:pt-2.5 max-[375px]:pb-4 max-[375px]:text-xs {active ? 'text-[#FA5252]' : 'text-[#7B7B7B] hover:text-[#FA5252] dark:hover:text-[#FA5252]'}"
				>
					{item.label}
					{#if active}
						<div class="absolute bottom-0 left-3 right-3 h-0.5 rounded-full gradient-background-fast"></div>
					{/if}
				</a>
			{/each}
			<button
				on:click={theme.toggle}
				class="flex-1 text-center pt-3.5 pb-5 text-sm font-medium transition-colors max-[375px]:pt-2.5 max-[375px]:pb-4 max-[375px]:text-xs {$theme === 'dark' ? 'text-[#FA5252]' : 'text-[#7B7B7B] hover:text-[#FA5252] dark:hover:text-[#FA5252]'}"
				aria-label="Toggle theme"
			>
				{#if $theme === 'dark'}
					☀️
				{:else}
					🌙
				{/if}
			</button>
		</div>
	</div>
	<div
		class="container w-full bg-[#F3F6F6] print:bg-transparent dark:bg-black lg:bg-transparent lg:dark:bg-transparent justify-between mx-auto pt-5 pb-0 lg:py-5 lg:px-0 lg:pt-[60px] print:pt-0 print:py-0 print:p-0"
	>
	
		<div
			class="grid grid-cols-12 md:gap-5 xl:gap-10 lg:p-5 xl:p-0 justify-between lg:mt-[120px] lg:mb-[120px] print:hidden"
		>
			<div class="col-span-12 lg:col-span-4">
				<div
					class="w-full mb-6 print:mb-0 lg:mb-0 mx-auto bg-white text-center dark:bg-[#111111] px-6 lg:rounded-[20px] mt-[0px] lg:mt-0 lg:sticky top-44 print:relative print:top-0 print:h-screen lg:max-h-screen hidden lg:block"
					
				>
				<img
					alt="Portrait of {resume.basics.name}"
					src="{resume.basics.image}"

						decoding="async"
						class="w-[240px] print:w-[360px]  absolute left-[50%] transform -translate-x-[50%] h-[240px] print:h-[360px] drop-shadow-xl mx-auto rounded-[20px] -mt-[140px] print:mt-0 print:relative print:left-0 print:top-0 print:mx-auto print:translate-x-0 print:translate-y-0"
						loading="lazy"
					/>

					<div class="pt-[100px] pb-2 print:pt-0">

						<h1 class="mt-6 mb-1 text-4xl font-semibold dark:text-white">
							{resume.basics.name}
						</h1>

						<h2 class="mt-4 mb-4 text-[#7B7B7B] inline-block dark:bg-[#1D1D1D] print:bg-[#F3F6F6] print:text-[#1D1D1D] px-5 py-1.5 rounded-lg dark:text-[#A6A6A6]">
							{resume.basics.label}
						</h2>
						
						<div class="p-5 print:p-3 rounded-2xl mt-2 print:mt-0 bg-[#F3F6F6] dark:bg-[#1D1D1D]">

							{#if resume.basics.availability?.status === 'open'}
								<div class="flex justify-center py-2.5 -mx-5 -mt-5 mb-0 rounded-t-2xl border-b border-[#E3E3E3] dark:border-[#3D3A3A] text-xs font-medium text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/50">
									<span class="flex items-center gap-1">
										<span class="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-breathe" />
										Open for {resume.basics.availability.workType.join(", ")}
									</span>
								</div>
							{/if}

							<div class="flex py-2 border-b border-[#E3E3E3] dark:border-[#3D3A3A]">
								<div class="text-left ml-2.5">
									<p class="text-xs text-[#44566C] dark:text-[#A6A6A6]">Location</p>
									<a class="text-xs dark:text-white break-all hover:text-[#FA5252] duration-300 transition" target="_blank" href="https://www.google.de/maps/place/{resume.basics.location.city}/">
										{resume.basics.location.city}, 
										{resume.basics.location.countryCode}
									</a>
								</div>
							</div>
							<div class="flex py-2 border-b border-[#E3E3E3] dark:border-[#3D3A3A]">
								<div class="text-left ml-2.5">
									<p class="text-xs text-[#44566C] dark:text-[#A6A6A6]">Email</p>
									<p class="text-xs dark:text-white break-all">
										<a
											class="hover:text-[#FA5252] duration-300 transition"
											href="mailto:{resume.basics.email}">{resume.basics.email}</a
										>
									</p>
								</div>
							</div>
							<div class="flex py-2 border-b border-[#E3E3E3] dark:border-[#3D3A3A]">
								<div class="text-left ml-2.5">
									<p class="text-xs text-[#44566C] dark:text-[#A6A6A6]">GitHub</p>
									<p class="text-xs dark:text-white break-all">
										<a class="hover:text-[#FA5252] duration-300 transition" target="_blank" href="{resume.basics.profiles[0].url}">
											@{resume.basics.profiles[0].username}
										</a>
									</p>
								</div>
							</div>
							<div class="flex py-2 border-b border-[#E3E3E3] dark:border-[#3D3A3A]">
								<div class="text-left ml-2.5">
									<p class="text-xs text-[#44566C] dark:text-[#A6A6A6]">Age / Nationality</p>
									<p class="text-xs dark:text-white">{age} / {resume.basics.birth.countryCode}</p>
								</div>

							</div>

							<div class="flex py-2 border-b border-[#E3E3E3] dark:border-[#3D3A3A]">
								<div class="text-left ml-2.5">
									<p class="text-xs text-[#44566C] dark:text-[#A6A6A6]">Languages</p>
									<div class="flex gap-x-2 gap-y-1 text-xs flex-wrap">
										{#each resume.languages as language }
											<div>{language.language} ({language.fluency})</div>
										{/each}
									</div>

								</div>
							</div>

						</div>
					</div>

					<div class="pt-4 pb-4 hidden lg:block">
						<button on:click={() => window.print()}
							class="w-full py-2.5 px-4 rounded-lg bg-[#FA5252] text-white text-sm font-medium hover:bg-[#e04848] transition-colors cursor-pointer">
							↓ Download PDF
						</button>

						<a href="{base}/exports"
							class="mt-2 block w-full py-2 px-4 rounded-lg text-center text-sm font-medium text-[#7B7B7B] dark:text-[#7B7B7B] hover:text-[#FA5252] dark:hover:text-[#FA5252] transition-colors">
							Download Export Formats
						</a>
					</div>

				</div>
			</div>

			<div class="col-span-12 lg:col-span-8">

				<div class="bg-white dark:bg-[#111111] md:rounded-[20px] pt-[140px] lg:pt-0 mt-0 lg:mt-0 max-[375px]:pt-[125px] print:p-0 print:m-0">
					<header class="print:hidden hidden lg:block bg-[#F8F9FA] dark:bg-[#1A1A1A] rounded-t-[20px] border-b border-[#E3E3E3] dark:border-[#3D3A3A]">
						<nav class="flex items-center gap-1 px-6 pt-3 pb-3">
							<MenuItem path="" icon="about">About</MenuItem>
							<MenuItem path="resume" icon="resume">Resume</MenuItem>
							<MenuItem path="portfolio" icon="works">Works</MenuItem>
							<button
								on:click={theme.toggle}
								class="ml-auto p-2 rounded hover:text-[#FA5252] dark:hover:text-[#FA5252] transition-colors"
								aria-label="Toggle theme"
							>
								{#if $theme === 'dark'}
									☀️
								{:else}
									🌙
								{/if}
							</button>
						</nav>
					</header>
		
				<div class="min-h-full mb-0 lg:mb-6 lg:px-12 pb-0 lg:pb-12 mx-auto relative px-6 print:p-0 print:m-0 print:pt-[0px]">
					<PageTransition url={data.url}>
						<slot />
					</PageTransition>
				</div>
			</div>
		</div>
		</div>

		<div class="hidden print:block">
			<PrintDocument {resume} fullDetails={data.fullDetails} />
		</div>
	</div>

	{#if showBackToTop}
		<button
			on:click={scrollToTop}
			aria-label="Back to top"
			class="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#FA5252] text-white shadow-[0_4px_12px_rgba(0,0,0,0.35)] flex items-center justify-center hover:bg-[#e04848] transition-colors duration-200"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
			</svg>
		</button>
	{/if}
</div>
