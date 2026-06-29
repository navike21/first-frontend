/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

/**
 * Minimal ambient typing for `process`, referenced only behind
 * `typeof process !== 'undefined'` guards for test-environment branching.
 * Avoids pulling all of @types/node into browser code.
 */
declare const process: {
  env: Record<string, string | undefined>
}
