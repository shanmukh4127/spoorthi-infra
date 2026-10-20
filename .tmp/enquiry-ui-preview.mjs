import path from 'node:path'
import { createApp, hashPassword } from '../server/app.mjs'
const app = await createApp({ dataDirectory: path.resolve('.tmp/enquiry-ui-data'), distDirectory: path.resolve('dist'), seedPath: path.resolve('src/data/adminDatabase.json'), adminUsername: 'enquiry-qa', passwordHash: hashPassword('enquiry-ui-test-password'), origin: 'http://localhost:5175', secureCookies: false })
app.server.listen(5175, '127.0.0.1', () => console.log('Isolated enquiry preview ready on localhost:5175'))
process.on('SIGINT', async () => { await app.close(); process.exit(0) })
