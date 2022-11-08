import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {media} from 'sanity-plugin-media';
import {visionTool} from '@sanity/vision';
import {scheduledPublishing} from '@sanity/scheduled-publishing';
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'omhh2',

  projectId: 'ayry6yb1',
  dataset: 'production',

  plugins: [
    deskTool(),
    scheduledPublishing(),
    media(),
    visionTool({defaultApiVersion: "v2022-11-08"}),
  ],

  schema: {
    types: schemaTypes,
  },
})
