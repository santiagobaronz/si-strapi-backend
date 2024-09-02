module.exports = {
    filterByUnitAndResourceType: async (ctx) => {
      const { identifier, page = 1, pageSize = 1 } = ctx.request.body;
  
      // Validar los parámetros de página y tamaño de página
      if (page < 1 || pageSize < 1) {
        return ctx.badRequest('Page and pageSize must be greater than 0');
      }
  
      const offset = (page - 1) * pageSize;
  
      try {
        // Realizar la consulta paginada
        const data = await strapi.db.query('api::resource.resource').findMany({
          where: {
            resource_type: {
              identifier: identifier,
            },
          },
          populate: {
            image: true,
            location: true,
          },
          offset, // Usar offset para la paginación
          limit: pageSize, // Limitar el número de resultados por página
          orderBy: { id: 'asc' },
        });
  
        // Contar el total de elementos
        const total = await strapi.db.query('api::resource.resource').count({
          where: {
            resource_type: {
              identifier: identifier,
            },
          },
        });
  
        // Calcular el número total de páginas
        const pageCount = Math.ceil(total / pageSize);
  
        return {
          data,
          meta: {
            pagination: {
              page,
              pageSize,
              pageCount,
              total,
            },
          },
        };
  
      } catch (err) {
        return ctx.internalServerError('Error al buscar recursos', err);
      }
    },
  };