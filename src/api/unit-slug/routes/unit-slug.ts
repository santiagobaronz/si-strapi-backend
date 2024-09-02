module.exports = {
	routes: [
		{
			method: 'POST',
			path: '/unit-slug',
			handler: 'unit-slug.unitSlug',
			config: {
				policies: [],
				middlewares: [],
			},
		},
	],
};