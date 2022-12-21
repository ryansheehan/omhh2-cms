import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {media} from 'sanity-plugin-media';
import {visionTool} from '@sanity/vision';
// import {scheduledPublishing} from '@sanity/scheduled-publishing';
import {schemaTypes} from './src/schemas'
import {usda} from './src/plugins/usda';


export default defineConfig({
  name: 'default',
  title: 'omhh2',

  projectId: import.meta.env.SANITY_STUDIO_PROJECT_ID,
  dataset: import.meta.env.SANITY_STUDIO_DATASET,

  plugins: [
    deskTool(),
    // scheduledPublishing(),
    media(),
    visionTool({defaultApiVersion: "v2022-11-08"}),
    usda(),
  ],

  schema: {
    types: schemaTypes,
  },
})
