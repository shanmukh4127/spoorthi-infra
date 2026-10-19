import readline from 'node:readline'
import { Writable } from 'node:stream'
import { hashPassword } from './app.mjs'

if (!process.stdin.isTTY) throw new Error('Run this command in an interactive terminal to enter the administrator password privately.')
let muted = false
const output = new Writable({ write(chunk, encoding, done) { if (!muted) process.stdout.write(chunk, encoding); done() } })
const prompt = readline.createInterface({ input: process.stdin, output, terminal: true })
process.stdout.write('Administrator password (at least 14 characters; hidden): ')
muted = true
prompt.question('', password => {
  prompt.close()
  process.stdout.write('\n')
  try { console.log(hashPassword(password)) } catch (error) { console.error(error.message); process.exitCode = 1 }
})
