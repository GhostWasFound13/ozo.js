const { exec } = require("child_process");

module.exports = async function autoUpdate(packageName) {
    console.log("Checking for updates...");
    exec("npm outdated --json", (error, stdout) => {
        if (error) {
            console.error("Failed to check for updates:", error.message);
            return;
        }

        const updates = JSON.parse(stdout || "{}");

        if (updates[packageName]) {
            console.log(`Update available for ${packageName}: ${updates[packageName].current} -> ${updates[packageName].latest}`);
            console.log("Updating package...");

            exec(`npm install ${packageName}@latest`, (err, out) => {
                if (err) {
                    console.error("Failed to update package:", err.message);
                    return;
                }
                console.log("Package updated successfully. Please restart the bot.");
                process.exit(0); // Exit to prompt restart
            });
        } else {
            console.log("No updates available.");
        }
    });
};
