<script lang="ts">
	import { formatDate } from '$lib/helper'

	export let data
    const resume = data.props.resume;
</script>

<!-- SEO -->
<svelte:head>
	<title>{data.meta.title} | {resume.basics.name}´s Blog</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content="{data.meta.title} | {resume.basics.name}´s Blog" />
</svelte:head>

<article class="pt-12 print:pt-0">
  <!-- Title -->
	<hgroup>
        <div class="flex pb-4">
            <h2 class="text-4xl">{data.meta.title}</h2>
            <div class="flex grow h-1 mt-5 ml-3 gradient-background-line"></div>
        </div>
        <p>Published at {formatDate(data.meta.date)}</p>
	</hgroup>

  <!-- Tags -->
	<div class="tags">
		{#each data.meta.categories as category}
			<span class="surface-4">&num;{category}</span>
		{/each}
	</div>

  <!-- Post -->
	<div class="prose pt-6">
		<svelte:component this={data.content} />
	</div>
</article>

<style>
	article {
		max-inline-size: var(--size-content-3);
		margin-inline: auto;
	}

	h1 {
		text-transform: capitalize;
	}

	h1 + p {
		margin-top: var(--size-2);
		color: var(--text-2);
	}

	.tags {
		display: flex;
		gap: var(--size-3);
		margin-top: var(--size-7);
	}

	.tags > * {
		padding: var(--size-2) var(--size-3);
		border-radius: var(--radius-round);
	}
</style>