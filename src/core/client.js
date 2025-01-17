const { Bot } = require("./base.js");
const { Client } = require("discord.js");
const version = require("../../package.json").version;

class ClientBot extends Bot {
    constructor(opt) {
        super(opt);
        this.client = new Client({
            intents: this.opt.intents.map((intent) => GatewayIntentBits[intent]),
            partials: this.opt.partials.map((partial) => Partials[partial]),
        });
        this.client.simpler = this;
        this.#start();
    }

    #start() {
        // Load events dynamically
        this.events.forEach((event) => {
            if (typeof this[`on${event}`] === "function") {
                this[`on${event}`]();
            }
        });

        // Shard events
        if (this.events.includes("ShardReady")) this.onShardReady();
        if (this.events.includes("ShardDisconnect")) this.onShardDisconnect();
        if (this.events.includes("ShardReconnecting")) this.onShardReconnecting();
    }

    onShardReady() {
        this.client.on("shardReady", async (id, guilds) => {
            await require("./handler/command/shardReady.js")(id, this);
        });
    }

    onShardDisconnect() {
        this.client.on("shardDisconnect", async (event, id) => {
            await require("./handler/command/shardDisconnect.js")(event, id, this);
        });
    }

    onShardReconnecting() {
        this.client.on("shardReconnecting", async (id) => {
            await require("./handler/command/shardReconnecting.js")(id, this);
        });
    }

    onMessage() {
        this.client.on("messageCreate", async (msg) => {
            await require("./handler/command/default.js")(msg, this);
            await require("./handler/command/always.js")(msg, this);
        });
    }

    async login(token) {
        await this.client.login(token);
        this.client.prefix = this.prefix;
        console.log(`Initialized on ${this.client.user.tag}\nMade with: discord.js v14\nv${version}\nJoin official support server: https://discord.gg/DW4CCH236j`);
    }
}

module.exports = ClientBot;
