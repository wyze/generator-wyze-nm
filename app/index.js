'use strict' // eslint-disable-line strict

const assign = require('object-assign')
const humanize = require('humanize-url')
const pify = require('pify')
const yeoman = require('yeoman-generator')

module.exports = class extends yeoman.Base {
  init() {
    const prompts = [
      {
        name: 'module',
        message: 'What is your module name?',
        default: this.appname.replace(/\s/g, '-'),
      },
      {
        name: 'description',
        message: 'What does your module do?',
      },
      {
        name: 'url',
        message: 'What is your personal website URL?',
        filter: url => humanize(url),
        store: true,
      },
      {
        name: 'github',
        message: 'What is your GitHub username?',
        store: true,
        default: () => pify(this.user.github.username)(),
        validate: user =>
          user.length > 0 ? true : 'You have to provide a username!',
      },
    ]

    return this.prompt(prompts)
      .then(answers => {
        this.answers = answers
      })
  }

  default() {
    const system = {
      name: this.user.git.name(),
      email: this.user.git.email(),
      year: new Date().getFullYear(),
    }
    const props = assign({}, this.answers, system)
    const mv = ( from, to ) =>
      this.fs.move(this.destinationPath(from), this.destinationPath(to))

    this.fs.copyTpl(
      `${this.templatePath()}/**`,
      this.destinationPath(),
      props
    )

    mv('_package.json', 'package.json')
    mv('editorconfig', '.editorconfig')
    mv('gitattributes', '.gitattributes')
    mv('gitignore', '.gitignore')
    mv('travis.yml', '.travis.yml')
  }

  git() {
    this.spawnCommandSync('git', [ 'init' ])
  }

  install() {
    this.npmInstall(
      [
        'ava',
        'babel-cli',
        'babel-preset-es2015',
        'babel-preset-stage-2',
        'babel-register',
        'codecov',
        'eslint',
        'eslint-config-airbnb',
        'eslint-config-wyze',
        'eslint-plugin-import',
        'eslint-plugin-wyze',
        'nyc',
        'rimraf',
      ],
      { 'save-dev': true }
    )
  }
}
