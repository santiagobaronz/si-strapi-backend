module.exports = {
	routes: [
		{
			method: 'POST',
			path: '/resources-filter/unit-and-resource-type',
			handler: 'resources-filter.filterByUnitAndResourceType',
			config: {
				policies: [],
				middlewares: [],
			},
		},
	],
};
