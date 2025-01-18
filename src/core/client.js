const { Bot } = require("./base.js");
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const version = require("../../package.json").version;
const createConsoleMessage = require("../utils/createConsoleMessage"); // Import createConsoleMessage function

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
        this.events.forEach((event) => {
            if (typeof this[`on${event}`] === "function") {
                this[`on${event}`]();
            }
        });

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
    onReactionRemove() {
    this.client.on("messageReactionRemove", async (reaction, user) => {
        await require("../events/message/reactionDelete.js")(reaction, user, this);
    });
    }
    onChannelDelete() {
    this.client.on("channelDelete", async (channel) => {
        await require("../events/channel/channelDelete.js")(channel, this);
    });
}

   onChannelUpdate() {
    this.client.on("channelUpdate", async (oldChannel, newChannel) => {
        await require("../events/channel/channelUpdate.js")(oldChannel, newChannel, this);
    });
}

  onChannelCreate() {
    this.client.on("channelCreate", async (channel) => {
        await require("../events/channel/channelCreate.js")(channel, this);
    });
}

    async login(token) {
        await this.client.login(token);
        this.client.prefix = this.prefix;
        createConsoleMessage(
            [
                {
                    text: `Initialized on ${this.client.user.tag}`,
                    textColor: "green"
                },
                {
                    text: "Made with: discord.js v14",
                    textColor: "blue"
                },
                {
                    text: `v${version}`,
                    textColor: "yellow"
                },
                {
                    text: "Join the official support server: https://discord.gg/DW4CCH236j",
                    textColor: "cyan"
                }
            ],
            "white",
            {
                text: "Ozo.js Bot Startup",
                textColor: "magenta"
            }
        );
    }
}

module.exports = ClientBot;
