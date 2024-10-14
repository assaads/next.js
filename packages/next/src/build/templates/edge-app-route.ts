import { createServerModuleMap } from '../../server/app-render/action-utils'
import { setReferenceManifestsSingleton } from '../../server/app-render/encryption-utils'
import { EdgeRouteModuleWrapper } from '../../server/web/edge-route-module-wrapper'

// Import the userland code.
import * as module from 'VAR_USERLAND'

const maybeJSONParse = (str?: string) => (str ? JSON.parse(str) : undefined)

const rscManifest = self.__RSC_MANIFEST?.['VAR_PAGE']
const rscServerManifest = maybeJSONParse(self.__RSC_SERVER_MANIFEST)

if (rscManifest && rscServerManifest) {
  setReferenceManifestsSingleton({
    clientReferenceManifest: rscManifest,
    serverActionsManifest: rscServerManifest,
    serverModuleMap: createServerModuleMap({
      serverActionsManifest: rscServerManifest,
      pageName: 'VAR_PAGE',
    }),
  })
}

export const ComponentMod = module

export default EdgeRouteModuleWrapper.wrap(module.routeModule)
