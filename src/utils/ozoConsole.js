const chalk = require("chalk");

function createConsoleMessage(messages, defaultColor = "white", header = null) {
    if (!Array.isArray(messages)) {
        throw new Error("The first argument must be an array of message objects.");
    }

    const formattedMessages = messages.map((msg) => {
        if (typeof msg.text !== "string") {
            throw new Error("Each message must have a 'text' (string).");
        }

        const textColor = msg.textColor || defaultColor;

        // Check for type and apply corresponding styles
        if (msg.type === "error") {
            return chalk.bold.red(msg.text); // Error styled in bold red
        }

        // Default styling
        return chalk[textColor](msg.text);
    });

    const headerMessage = header
        ? chalk[header.textColor || defaultColor](header.text || "")
        : null;

    const finalMessage = `${headerMessage ? headerMessage + "\n" : ""}${formattedMessages.join("\n")}`;

    console.log(finalMessage);
}

module.exports = createConsoleMessage;
