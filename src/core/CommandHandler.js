const fs = require("fs");
const path = require("path");

class CommandHandler {
    constructor(opts) {
        this.bot = opts.client || opts.bot;
    }

    load(folder) {
        const bot = this.bot;
        const consoleText = [];
        const dirFolder = path.join(process.cwd(), folder);

        const files = fs.readdirSync(dirFolder).filter((file) => file.endsWith("js"));
        files.forEach((x) => {
            try {
                const theFile = require(`${dirFolder}/${x}`);
                const theCmd = bot.cmd[theFile?.type || "default"];
                if (theCmd !== undefined) {
                    theCmd.set(theFile.name, theFile);
                    consoleText.push("Loaded " + dirFolder + "/" + x);
                } else {
                    consoleText.push("Command type is invalid " + dirFolder + "/" + x);
                }
            } catch (e) {
                consoleText.push("Failed to load " + dirFolder + "/" + x);
            }
        });
        console.log(consoleText.join("\n|-------------------------------|\n"));
    }
}

module.exports = CommandHandler;
