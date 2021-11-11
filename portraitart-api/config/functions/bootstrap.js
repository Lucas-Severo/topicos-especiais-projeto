'use strict';

const pluralize = require('pluralize')

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
            count: PUBLIC,
            find: PUBLIC,
            findone: AUTH,
            update: AUTH
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

    const setDefaultPermissionsUser = async () => {
        const permissions = await strapi
            .query("permission", "users-permissions")
            .find({ type: "users-permissions", role: publicRole.id, controller: 'user' })
    
        await Promise.all(
            permissions.map(p =>
                strapi
                .query("permission", "users-permissions")
                .update({id: p.id}, { 
                    enabled: true, 
                    role: obterPapelPorPermissao(permissionsUser[p.controller][p.action])
                })
            )
        );
    }
  
    const setDefaultPermissionsApplication = async () => {
        const tabelas = Object.keys(permissionsByDatabase)
        
        for(let tabela of tabelas) {
            for (let action of Object.keys(permissionsByDatabase[tabela])) {
                let enabledAuth = false
                let enabledPublic = false

                if(permissionsByDatabase[tabela][action] == PUBLIC) {
                    enabledAuth = false
                    enabledPublic = true
                } else if (permissionsByDatabase[tabela][action] == AUTH) {
                    enabledAuth = true
                    enabledPublic = false
                } else {
                    enabledAuth = true
                    enabledPublic = true
                }

                // Busca as permissões públicas e privadas de uma ação
                const permissionPublic = await strapi
                    .query("permission", "users-permissions")
                    .find({ type: "application", role: publicRole.id, action: action, controller: tabela });

                const permissionAuth = await strapi
                    .query("permission", "users-permissions")
                    .find({ type: "application", role: authenticatedRole.id, action: action, controller: tabela });

                // Seta se essa ação está habilitada ou não, dependendo da permissão  
                await updatePermissionsPublicRole(permissionPublic, enabledPublic)
                await updatePermissionsAuthRole(permissionAuth, enabledAuth)
            }
        }
    };

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

  const obterPapelPorPermissao = (permissao) => {
    if (permissao == AUTH) {
        return authenticatedRole
    } else {
        return publicRole
    }
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
}

module.exports = async() => {
    definePluralization()
    publicRole = await findPublicRole();
    authenticatedRole = await findAuthenticatedRole()

    const shouldSetDefaultPermissions = await isFirstRun();
    if (shouldSetDefaultPermissions) {
        await setDefaultPermissionsUser();
        await setDefaultPermissionsApplication();
    }
};
