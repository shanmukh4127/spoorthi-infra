import {createRequire} from 'node:module'
const sharp=createRequire('C:/Users/Pardhu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/package.json')('sharp')
await sharp('public/assets/tejes/cinematic/house/originals/marble-surface.png').webp({quality:94,effort:6}).toFile('public/assets/tejes/cinematic/house/marble-surface.webp')
