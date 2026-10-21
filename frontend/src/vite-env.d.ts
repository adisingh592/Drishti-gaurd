/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backend origin. Leave empty in development to use the Vite `/api` proxy. */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
