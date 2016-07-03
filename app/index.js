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
        validate: x => x.length > 0 ? true : 'You have to provide a username!',
      },
    ]

    return this.prompt(prompts)
      .then(props => {
        const system = {
          name: this.user.git.name(),
          email: this.user.git.email(),
          year: new Date().getFullYear(),
        }
        const tpl = assign({}, props, system)

        this.fs.copyTpl(
          this.templatePath('_package.json'),
          this.destinationPath('package.json'),
          tpl
        )
      })
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
        'eslint',
        'eslint-config-airbnb',
        'eslint-config-wyze',
        'eslint-plugin-import',
        'eslint-plugin-wyze',
      ],
      { 'save-dev': true }
    )
  }
}
