import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltePreprocess } from 'svelte-preprocess';
import { defineConfig } from 'vite';

const dev = process.argv.includes('dev');

// SvelteKit 3 reads its configuration from the sveltekit() plugin options;
// svelte.config.js is no longer supported.
export default defineConfig({
	plugins: [
		sveltekit({
			preprocess: [vitePreprocess(), sveltePreprocess({ postcss: true })],
			adapter: adapter(),
			paths: {
				// BASE_PATH (e.g. "/subdir") is only set when hosting under a sub-path; unset on the VPS.
				base: dev ? '' : ((process.env.BASE_PATH ?? '') as '' | `/${string}`)
			}
		})
	],
	build: {
		target: 'esnext'
	}
});
