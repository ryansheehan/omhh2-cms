/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly SANITY_STUDIO_PROJECT_ID: string;
    readonly SANITY_STUDIO_DATASET: string;
    readonly SANITY_STUDIO_CLIENT_VERSION: string;
    readonly SANITY_STUDIO_USDA_API_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
