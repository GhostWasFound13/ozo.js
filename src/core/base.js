const { Client, GatewayIntentBits, Partials, ActivityType } = require("discord.js");
const { DefaultWebSocketManagerOptions } = require("@discordjs/ws");
const newMap = require("./cache/cache.js");
const Db = require("meatdb");
const fs = require("fs");
const path = require("path");
const { checkForUpdates } = require("./utils/autoUpdate.js");
const api = require("./handler/api.js");

class Bot {
    constructor(opt) {
        this.opt = opt;
        this.prefix = opt.prefix;
        this.db = new Db({
            path: opt?.database?.path,
        });
        this.cmd = require("./handler/commandType.js");
        this.funcParser = require("./funcs/parser");
        this.autoUpdate = opt.autoUpdate || false;
        this.functions = new newMap();
        this.variable = new newMap();
        this.status = new newMap();
        this.events = opt.events || [];
        this.mobilePlatform = opt.mobilePlatform || false; // Enable mobile platform if true
        this.identifyProperties = opt.identifyProperties || {}; // Custom identifyProperties option
        this.#start();

        if (typeof this.prefix !== "string") throw new Error("Prefix must be a string");
        if (this.autoUpdate) checkForUpdates(require("../package.json").name);
    }

    #start() {
        const clientOptions = {
            intents: this.opt.intents.map((intent) => GatewayIntentBits[intent]),
            partials: this.opt.partials.map((partial) => Partials[partial]),
        };

        // Add custom WebSocket options for mobilePlatform
        if (this.mobilePlatform) {
            clientOptions.ws = new DefaultWebSocketManagerOptions({
                identifyProperties: {
                    os: this.identifyProperties.os || "unknown", // Default OS
                    browser: this.identifyProperties.browser || "Discord", // Default Browser
                    device: this.identifyProperties.device || "Desktop", // Default Device
                },
            });
        }

        const client = new Client(clientOptions);
        this.client = client;
        this.client.simpler = this;

        this.events.forEach((event) => {
            if (typeof this[`on${event}`] === "function") {
                this[`on${event}`]();
            }
        });

        const dirFolder = path.join(__dirname, "funcs", "functions");
        const folders = fs.readdirSync(dirFolder);
        folders.forEach((x) => {
            const files = fs.readdirSync(path.join(dirFolder, x)).filter((file) => file.endsWith("js"));
            files.forEach((y) => {
                const file = require(path.join(dirFolder, x, y));
                this.functions.set("$" + y.replace(".js", "").toLowerCase(), file.code);
            });
        });

        this.client.on("ready", async () => {
            while (this.status.size > 0) {
                for (let [k, v] of this.status) {
                    this.client.user.setPresence({
                        activities: [
                            {
                                name: v.text,
                                type: ActivityType[v.type.toUpperCase()],
                            },
                        ],
                        status: v.status,
                    });
                    await new Promise((resolve) => setTimeout(resolve, v.time));
                }
            }
        });
    }

    botJoinCommand(opt) {
        this.cmd.botJoin.set(this.cmd.botJoin.size, opt);
    }

    botLeaveCommand(opt) {
        this.cmd.botLeave.set(this.cmd.botLeave.size, opt);
    }

    command(...opts) {
        for (const opt of opts) {
            if (opt?.name !== "$always") {
                this.cmd["default"].set(opt.name.toLowerCase(), opt);
            } else {
                this.cmd["alwaysExecute"].set(this.cmd.alwaysExecute.size, opt);
            }
        }
    }

    executableCommand(opt) {
        this.cmd.executable.set(opt.name.toLowerCase(), opt);
    }

    intervalCommand(opt) {
        (async () => {
            const commandData = opt.channel?.includes("$")
                ? await require("./handler/function.js")(opt.channel, "channel", this.db, {}, this.client, this)
                : opt.channel || {};
            setInterval(async () => {
                await require("./handler/function.js")(opt.code, "intervalCommand", this.db, commandData, this.client, this);
            }, opt.every);
            if (opt?.onStartup === true) {
                this.client.on("ready", async () => {
                    await require("./handler/function.js")(opt.code, "intervalCommand", this.db, commandData, this.client, this);
                });
            }
        })();
    }

    memberJoinCommand(opt) {
        this.cmd.memberJoin.set(this.cmd.memberJoin.size, opt);
    }

    memberLeaveCommand(opt) {
        this.cmd.memberLeave.set(this.cmd.memberLeave.size, opt);
    }

    reactionAddCommand(opt) {
        this.cmd.reactionAdd.set(this.cmd.reactionAdd.size, opt);
    }

    ready(opt) {
        this.client.on("ready", async () => {
            await require("./handler/function.js")(opt.code, undefined, this.db, {}, this.client, this);
        });
    }

    variables(opt) {
        for (const [name, value] of Object.entries(opt)) {
            this.variable.set(name, value);
        }
    }

    createCustomFunction(opt) {
        if (!opt?.name || !opt?.name?.includes("$") || typeof opt?.code !== "function") throw new Error("Invalid Name or Code");
        this.functions.set(opt.name.toLowerCase(), opt.code);
    }

    addPresence(...options) {
        if (!options) throw new Error("Invalid presence options provided!");
        options.forEach((s) => {
            if (s.time < 12000) throw new Error("Status time must be at least 12 seconds!");
            this.status.set(s.text, s);
        });
    }
}

module.exports = {
    Bot,
};
