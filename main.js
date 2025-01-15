if (parseInt(process.version.replace("v", "")) < 16) {
    console.warn(
        "\x1b[31mWarning!\x1b[0m\n\x1b[33mOzo.js requires Node.js version 16 or higher to work. Your current Node.js version:",
        process.version,
        "Please update your Node.js version and try again.\x1b[0m"
    );
    process.exit();
} else {
    const client = require("./src/index.js"); // Import the Bot class
    const { CommandHandler } = require("./src/core/CommandHandler.js"); // Import the CommandHandler class
    require("./src/handler/string.js"); // Import additional handlers or utilities

    module.exports = {
        Bot: client.Bot,
        CommandHandler, // Export CommandHandler directly
    };
}
