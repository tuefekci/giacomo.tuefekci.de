export type Categories = 'sveltekit' | 'svelte'

export type GithubStats = {
	stars: number;
	followers: number;
	publicRepos: number;
	contributions: number;
	fetchedAt: string | null;
};

export type Post = {
	title: string
	slug: string
	image: string
	description: string
	date: string
	categories: Categories[]
	published: boolean
}