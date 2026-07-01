export const prerender = true;

import "../app.css";

import * as json_resume from '../data/resume.json';

export async function load({ url  }) {
	return {
		url: url.pathname,
		props: {
			resume: json_resume.default,
		},
		fullDetails: import.meta.env.VITE_FULL_DETAILS === 'true',
	};
}