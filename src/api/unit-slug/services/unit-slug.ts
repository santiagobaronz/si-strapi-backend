module.exports = {
    unitSlug: async (ctx) => {

        const params = ctx.request.body;

        try {
            const response = await strapi.db.query('api::unit.unit').findOne({
                where: { slug: params.slug },
                populate: {
                    schedule: true,
                    resource_types: true,
                    image: true,
                },
            });

            if (!response) {
                return ctx.notFound('Unidad no encontrada');
            }

            return response;

        } catch (err) {
            return err;
        }
    },
};