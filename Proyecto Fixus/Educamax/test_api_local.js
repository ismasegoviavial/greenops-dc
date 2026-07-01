import { generateInfografia } from './src/services/api.js';

// We need to inject the fetch and env
// Wait, api.js uses import.meta.env, so it will fail in standard Node.js
