'use strict';

/**
 * A set of functions called "actions" for `custom-auth`
 */

const customAuth = async (ctx) => {

	const provider = ctx.params.provider || 'local';
	const params = ctx.request.body;

	const store = strapi.store({ type: 'plugin', name: 'users-permissions' });
	const grantSettings = await store.get({ key: 'grant' });
	const grantProvider = provider === 'local' ? 'email' : provider;

	if (provider === 'local') {

		//Check if user exist
		const user = await strapi.db.query("plugin::users-permissions.user").findOne({
			where: { $or: [{ username: params.identifier, }, { email: params.identifier, },], },
		})

		//If user does not exist return error
		if (!user) {
			return ({ error: 'Identificador o contraseña incorrecta' });
		}

		var validPassword = await strapi.plugins['users-permissions'].services.user.validatePassword(params.password, user.password);


		if (!validPassword) {
			const oneHourAgo = new Date(Date.now() - 60 * 1000);
			const lastAttemptDate = user.lastAttemptAt ? new Date(user.lastAttemptAt) : null;

			if (!lastAttemptDate || lastAttemptDate <= oneHourAgo) {

				await strapi.entityService.update("plugin::users-permissions.user", user.id, {
					data: {
						failedAttempts: 1,
						lastAttemptAt: new Date(),
					}
				})

			} else {
				const failedAttempts = (user.failedAttempts || 0) + 1;

				if (failedAttempts >= 3) {

					if (failedAttempts === 3) {
						await strapi.entityService.update("plugin::users-permissions.user", user.id, {
							data: {
								failedAttempts,
								blocked: true,
								lastAttemptAt: new Date(),
							}
						})
					}
					return ({ error: 'Tu cuenta ha sido bloqueada por multiples intentos.' });

				} else {
					await strapi.entityService.update("plugin::users-permissions.user", user.id, {
						data: {
							failedAttempts,
							lastAttemptAt: new Date(),
						}
					})
				}
			}
			return ({ error: 'Identificador o contraseña incorrecta' });
		}

		const advancedSettings = await store.get({ key: 'advanced' });
		const requiresConfirmation = user.confirmed;

		if (requiresConfirmation && user.confirmed !== true) {
			return ({ error: 'Tu email no esta confirmado' });
		}

		if (user.blocked) {
			const oneHourAgo = new Date(Date.now() - 60 * 1000);

			if (user.lastAttemptAt) {
				const lastAttemptDate = new Date(user.lastAttemptAt);

				if (lastAttemptDate <= oneHourAgo) {

					await strapi.entityService.update("plugin::users-permissions.user", user.id, {
						data: {
							failedAttempts: 0,
							lastAttemptAt: new Date(),
							blocked: false,
						}
					})
				} else {
					return ({ error: 'La cuenta esta bloqueada, intenta más tarde' });
				}
			} else {
				await strapi.entityService.update("plugin::users-permissions.user", user.id, {
					data: {
						failedAttempts: 0,
						lastAttemptAt: new Date(),
						blocked: false,
					}
				})
			}
		} else {
			await strapi.entityService.update("plugin::users-permissions.user", user.id, {
				data: {
					failedAttempts: 0,
					lastAttemptAt: new Date(),
				}
			})
		}

		const response = {
			jwt: strapi.plugins['users-permissions'].services.jwt.issue({
				id: user.id
			}),
			user
		}
		return response;
	}
}

module.exports = {
	customAuth: async (ctx) => {
		try {
			const result = await customAuth(ctx)
			ctx.body = result;
		} catch (err) {
			ctx.badRequest("Get articles controller error", { moreDetails: err });
		}
	}
};