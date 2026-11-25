import {defineCliConfig} from 'sanity/cli'
import {dataset, projectId} from './env'

export default defineCliConfig({
  api: {projectId, dataset},
  // `pnpm --filter studio deploy` publica el Studio en https://isabela.sanity.studio.
  // Tras el primer despliegue, Sanity muestra un `appId`: añádelo en `deployment.appId`
  // (sustituye a `studioHost`, que el CLI marca como obsoleto pero sigue funcionando).
  studioHost: 'isabela',
  deployment: {
    autoUpdates: true,
  },
  // `pnpm --filter studio schema:extract` → apps/studio/schema.json (entrada de `sanity typegen`).
  // Los campos con `required()` salen como no opcionales en los tipos generados.
  schemaExtraction: {
    path: './schema.json',
    enforceRequiredFields: true,
  },
})
