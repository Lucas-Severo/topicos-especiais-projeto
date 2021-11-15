'use strict';

const pluralize = require('pluralize')
const categorias = require('./categorias')

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#bootstrap
 */

    const AUTH = 1
    const PUBLIC = 2
    const BOTH = 3
    let publicRole = {}
    let authenticatedRole = {}

    const permissionsUser = {
        user: {
            create: PUBLIC,
            delete: AUTH,
            count: BOTH,
            find: BOTH,
            findone: BOTH,
            update: AUTH
        },
        auth: {
            tokendecrypt: BOTH
        }
    }

    const permissionsUpload = {
        upload: {
            upload: AUTH
        }
    }

    const permissionsByDatabase = {
        retrato: {
            create: AUTH,
            delete: AUTH,
            count: BOTH,
            find: BOTH,
            findone: BOTH,
            update: AUTH
        },
        categoria: {
            find: BOTH,
            findone: BOTH,
            count: BOTH
        }
    }


    const findPublicRole = async () => {
        const result = await strapi
            .query("role", "users-permissions")
            .findOne({ type: "public" });
        return result;
    };

    const findAuthenticatedRole = async() => {
        const result = await strapi
            .query("role", "users-permissions")
            .findOne({ type: "authenticated" });
        return result;
    }
  
    const setDefaultPermissionsApplication = async (objeto, type) => {
        const tabelas = Object.keys(objeto)
        
        for(let tabela of tabelas) {
            for (let action of Object.keys(objeto[tabela])) {
                const [enabledPublic, enabledAuth] = obterPapelAcaoPorPermissao(objeto[tabela][action])

                // Busca as permissões públicas e privadas de uma ação
                const [permissionPublic, permissionAuth] = await obterPermissoesAcao(type, action, tabela)

                // Seta se essa ação está habilitada ou não, dependendo da permissão  
                await updatePermissionsPublicRole(permissionPublic, enabledPublic)
                await updatePermissionsAuthRole(permissionAuth, enabledAuth)
            }
        }
    };

    const obterPapelAcaoPorPermissao = (permissao) => {
        if(permissao == PUBLIC) {
            return [true, false]
        }

        if (permissao == AUTH) {
            return [false, true]
        }

        return [true, true]
    }

    const obterPermissoesAcao = async (type, action, controller) => {
        const permissionPublic = await strapi
            .query("permission", "users-permissions")
            .find({ type: type, role: publicRole.id, action, controller });

        const permissionAuth = await strapi
            .query("permission", "users-permissions")
            .find({ type: type, role: authenticatedRole.id, action, controller });

        return [permissionPublic, permissionAuth]
    } 

    const updatePermissionsPublicRole = async (permissions, enabled) => {
        permissions.map(p => {
            strapi
                .query("permission", "users-permissions")
                .update({id: p.id}, { 
                    enabled: enabled,
                    role: publicRole
                })
        })
    }

    const updatePermissionsAuthRole = async (permissions, enabled) => {
        await Promise.all(
            permissions.map(p => {
                strapi
                    .query("permission", "users-permissions")
                    .update({id: p.id}, { 
                        enabled: enabled,
                        role: authenticatedRole
                    })
            })
        )
    }
  
  const isFirstRun = async () => {
    const pluginStore = strapi.store({
        environment: strapi.config.environment,
        type: "type",
        name: "setup"
    });
    const initHasRun = await pluginStore.get({ key: "initHasRun" });
    await pluginStore.set({ key: "initHasRun", value: false });
    return !initHasRun;
  };

const definePluralization = () => {
    pluralize.addPluralRule('retrato', 'retratos')
    pluralize.addPluralRule('categoria', 'categorias')
}

const seedCategorias = () => {
    categorias.categorias.forEach((categoria) => {
        strapi
        .query("categoria")
        .create({
            nome: categoria
        })
    })
}

module.exports = async() => {
    definePluralization()
    publicRole = await findPublicRole();
    authenticatedRole = await findAuthenticatedRole()

    const shouldSetDefaultPermissions = await isFirstRun();
    if (shouldSetDefaultPermissions) {
        await setDefaultPermissionsApplication(permissionsUser, "users-permissions");
        await setDefaultPermissionsApplication(permissionsUpload, "upload");
        await setDefaultPermissionsApplication(permissionsByDatabase, "application");

        seedCategorias()
    }
};
