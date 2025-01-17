const createConsoleMessage = require("./createConsoleMessage");

if (parseInt(process.version.replace("v", "")) < 16) {
    createConsoleMessage(
        [
            {
                text: "Warning!",
                textColor: "red",
                type: "error"
            },
            {
                text: `Ozo.js requires Node.js version 16 or higher to work. Your current Node.js version: ${process.version}`,
                textColor: "yellow"
            },
            {
                text: "Please update your Node.js version and try again.",
                textColor: "yellow"
            }
        ],
        "white",
        {
            text: "Ozo.js Startup Error",
            textColor: "cyan"
        }
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
