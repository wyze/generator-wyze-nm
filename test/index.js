import { join } from 'path'
import assert from 'yeoman-assert'
import helpers from 'yeoman-test'
import pify from 'pify'
import test from 'ava'

test('generates expected files', async t => {
  await pify(helpers.testDirectory)(join(__dirname, '..', 'temp'))

  const generator = helpers.createGenerator(
    'wyze-nm:app', [ '../app' ], null, { skipInstall: true }
  )

  helpers.mockPrompt(generator, {
    module: 'test',
    description: 'test',
    github: 'test',
    url: 'test.com',
  })

  await pify(generator.run.bind(generator))()

  assert.file([
    'src/index.js',
    'test/index.js',
    '.editorconfig',
    '.git',
    '.gitattributes',
    '.gitignore',
    '.travis.yml',
    'license',
    'package.json',
    'readme.md',
  ])

  t.pass()
})
