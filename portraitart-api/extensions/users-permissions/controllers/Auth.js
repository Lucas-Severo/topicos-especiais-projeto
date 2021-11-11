module.exports = {
    tokenDecrypt: async function(ctx) {
      const {token} = ctx.request.body;
  
      // check token requirement
      if (!token) {
        return ctx.badRequest('`token` param is missing')
      }
  
      try {
        const obj = await strapi.plugins[
          'users-permissions'
        ].services.jwt.verify(token);
  
        return obj;
      } catch (err) {
        return ctx.badRequest(err.toString());
      }
    }
  };