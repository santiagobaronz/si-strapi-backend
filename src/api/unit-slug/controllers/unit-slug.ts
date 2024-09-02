'use strict';

module.exports = {
	unitSlug: async (ctx) => {
		try {
			const data = await strapi.service("api::unit-slug.unit-slug").unitSlug(ctx);
			ctx.body = data;
		} catch (err) {
			ctx.badRequest("Error al encontrar la unidad", { moreDetails: err });
		}
	}
};