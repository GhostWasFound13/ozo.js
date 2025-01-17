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
            await require("../events/shards/shardReady.js")(id, this);
        });
    }

    onShardDisconnect() {
        this.client.on("shardDisconnect", async (event, id) => {
            await require("../events/shards/shardDisconnect.js")(event, id, this);
        });
    }

    onShardReconnecting() {
        this.client.on("shardReconnecting", async (id) => {
            await require("../events/shards/shardReconnecting.js")(id, this);
        });
    }

    onBotJoin() {
        this.client.on("guildCreate", async (guild) => {
            await require("../events/guild/botJoin.js")(guild, this);
        });
    }

    onBotLeave() {
        this.client.on("guildDelete", async (guild) => {
            await require("../events/guild/botLeave.js")(guild, this);
        });
    }

    onMessage() {
        this.client.on("messageCreate", async (msg) => {
            await require("../events/message/default.js")(msg, this);
            await require("../events/message/always.js")(msg, this);
        });
    }

    onMemberJoin() {
        this.client.on("guildMemberAdd", async (member) => {
            await require("../events/guild/memberJoin.js")(member, this);
        });
    }

    onMemberLeave() {
        this.client.on("guildMemberRemove", async (member) => {
            await require("../events/guild/memberLeave.js")(member, this);
        });
    }

    onReactionAdd() {
        this.client.on("messageReactionAdd", async (reaction, user) => {
            await require("../events/message/reactionAdd.js")(reaction, user, this);
        });
    }

    async login(token) {
        await this.client.login(token);
        this.client.prefix = this.prefix;
        console.log(`Initialized on ${this.client.user.tag}\nMade with: discord.js v14\nv${version}\nJoin official support server: https://discord.gg/DW4CCH236j`);
    }
}

module.exports = ClientBot;
