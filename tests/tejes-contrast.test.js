import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

function luminance(hex) {
  const rgb = hex.match(/[a-f\d]{2}/gi).map(value => parseInt(value, 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4)
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722
}
function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (values[0] + .05) / (values[1] + .05)
}

test('Tejes purple homepage palette keeps headings, descriptions, photo captions and CTA text readable', async () => {
  const css = await readFile(new URL('../src/styles/tejes-static-home.css', import.meta.url), 'utf8')
  const token = name => css.match(new RegExp(`--tejes-home-${name}:(#[a-f0-9]{6})(?:;|\\s)`))[1]
  const wordmark = await readFile(new URL('../public/assets/tejes/brand/wordmark.svg', import.meta.url), 'utf8')
  assert.equal(token('background'), wordmark.match(/fill="(#[a-f0-9]{6})"/)[1])
  assert.equal(token('surface'), '#5f2f60')
  for (const background of ['background', 'surface']) {
    for (const foreground of ['ink', 'secondary', 'accent']) {
      assert.ok(contrast(token(foreground), token(background)) >= 4.5, `${foreground} on ${background} must remain readable`)
    }
  }
  assert.ok(contrast('#4c264d', '#e4d8e4') >= 4.5)
  assert.match(css, /\.tfp-card figcaption \{ background:var\(--tejes-home-surface\)/)
})
