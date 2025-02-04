import { join } from 'path'

import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { skeleton } from '@skeletonlabs/tw-plugin'
/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')],
	theme: {
		extend: {},
	},
	plugins: [
		function({addUtilities}){
			const newUtilities = {
				".no-scrollbar::-webkit-scrollbar":{
					display: "none",
				},
				".no-scrollbar":{
					"-ms-overflow-style":"none",
					"scrollbar-width":"none",
				},
			};
			addUtilities(newUtilities)
		},
		require('tailwind-scrollbar'),
		forms,
		typography,
		skeleton({
			themes: {
				preset: [
					{
						name: 'rocket',
						enhancements: true,
					},
					{
						name: 'modern',
						enhancements: true,
					},
					{
						name: 'wintry',
						enhancements: true,
					},
					{
						name: 'skeleton',
						enhancements: true,
					},
				],
			},
		}),
	],
};
