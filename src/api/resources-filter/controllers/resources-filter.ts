'use strict';

module.exports = {
  filterByUnitAndResourceType: async (ctx) => {
    try {
      const data = await strapi.service("api::resources-filter.resources-filter").filterByUnitAndResourceType(ctx);
      ctx.body = data;
    } catch (err) {
      ctx.badRequest("Error al encontrar el recurso", { moreDetails: err });
    }
  }
};