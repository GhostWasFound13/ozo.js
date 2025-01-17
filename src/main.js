if (parseInt(process.version.replace("v", "")) < 16) {
    console.warn(
        "\x1b[31mWarning!\x1b[0m\n\x1b[33mOzo.js requires Node.js version 16 or higher to work. Your current Node.js version:",
        process.version,
        "Please update your Node.js version and try again.\x1b[0m"
    );
    process.exit();
} else {
    const ClientBot = require("./core/client.js"); // Import the ClientBot class (which extends Bot)
    const { CommandHandler } = require("./core/CommandHandler.js"); // Import the CommandHandler class
    require("./handler/string.js"); // Import additional handlers or utilities

    module.exports = {
        ClientBot, // Export only the ClientBot class, as it includes Bot's functionality
        CommandHandler,
    };
}
