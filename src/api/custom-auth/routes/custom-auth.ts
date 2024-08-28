module.exports = {
	routes: [
	  {
		method: 'POST',
		path: '/custom-auth',
		handler: 'custom-auth.customAuth',
		config: {
		  policies: [],
		  middlewares: [],
		},
	  },
	],
  };