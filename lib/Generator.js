// lib/Generator.js
const { getRepoList } = require('./http')
const ora = require('ora')
const inquirer = require('inquirer')

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

    // 核心创建逻辑
    create = async () => {


        const repo = await this.getRepo()

        console.log("用户选择了, repo=" + repo)

    }
}

module.exports = Generator;
