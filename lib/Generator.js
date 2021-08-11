// lib/Generator.js
const { getRepoList, getTagList } = require('./http')
const ora = require('ora')
const inquirer = require('inquirer')
const util = require('util')
const path = require('path')
const chalk = require('chalk')
const downloadGitRepo = require('download-git-repo') // 不支持 Promise

const wrapLoading = async (fn, message, ...args) => {
    const spining = ora(message) // Elegant terminal spinner
    spining.start()
    try {
        const result = await fn(...args)
        spining.succeed()
        return result
    } catch (error) {
        spining.fail("Request failed, error is: ", error)
    }
}

class Generator {
    constructor(name, targetDir) {
        // 目录名称
        this.name = name;
        // 创建位置
        this.targetDir = targetDir;
        this.downloadGitRepo = util.promisify(downloadGitRepo);
    }

    getRepo = async () => {
        const repoList = await wrapLoading(getRepoList, "wait fetch")
        if (!repoList) return

        const repoNames = repoList.map(item => item.name)

        const { repo } = await inquirer.prompt({
            name: "repo",
            type: "list",
            choices: repoNames,
            message: "Pleace choose a template"
        })

        return repo
    }

    getTag = async (repo) => {
        const tags = await wrapLoading(getTagList, "waiting fetch tag", repo);
        if (!tags) return;

        const tagsList = tags.map(item => item.name)

        const { tag } = await inquirer.prompt({
            name: 'tag',
            type: "list",
            choices: !!tagsList.length ? tagsList : [""],
            message: "choose a tag",
            default: ""
        }).catch((error) => {
            // Use user feedback for... whatever!!
            console.log(error)
        })
        return tag || ""
    }

    // 核心创建逻辑
    create = async () => {
        const repo = await this.getRepo()

        const tag = await this.getTag(repo)
        console.log("用户选择了, repo=" + repo, ",tag=" + tag)
        console.log(`\r\n`,path.resolve(process.cwd(), this.targetDir))

        await this.download(repo, tag)


        console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
        console.log(`\r\n  cd ${chalk.cyan(this.name)}`)

    }

    download = async (repo, tag) => {
        const requestUrl = `kitions/${repo}${tag ? "#" + tag : ""}`

        await wrapLoading(
            this.downloadGitRepo,
            "waiting download template",
            requestUrl,
            path.resolve(process.cwd(), this.targetDir)
        )
    }


}

module.exports = Generator;
