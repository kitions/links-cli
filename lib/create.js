// lib/create.js
const path = require("path")
const fs = require("fs-extra")
const inquirer = require('inquirer')
const Generator = require('./Generator')

module.exports = async function (name, options) {
    // 验证是否正常取到值
    // console.log('>>> create.js', name, options)

    // 当前命令行选择的目录
    const cwd = process.cwd()
    // 目标目录地址
    const targetAir = path.join(cwd, name)

    if (fs.existsSync(targetAir)) {
        // 直接删 有force操作
        if (options.force) {
            await fs.remove(targetAir)
        } else {
            // 询问用户是否确定覆盖
            let { action } = await inquirer.prompt([
                {
                    name: "action",
                    type: "list",
                    message: "Target Path already exists Pick an action:",
                    choices: [
                        {
                            name: "Overwrite",
                            value: "overwrite"
                        },
                        {
                            name: "Cancel",
                            value: false
                        }
                    ]
                }
            ])

            if(!action) return
            if(action === "overwrite"){
                console.log("\r\nRemoving...")
                await fs.remove(targetAir)
            }
        }
    }

    const generator = new Generator(name, targetAir)

    generator.create()
}