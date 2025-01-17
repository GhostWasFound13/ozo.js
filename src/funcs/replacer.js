module.exports = async (data, name, db, message, client, error, real) => {
  const util = require("../handler/utils/Util.js");

  // Error handling function
  function handleError(d, errorMessage) {
    const suppressErrors = d.data.datas.suppressErrors;
    const funcLine = isNaN(d.data.funcLine) ? undefined : d.data.funcLine + 1;

    // Generate error output
    let output = suppressErrors
      ? suppressErrors
          .replaceAll("{fullError}", `\`${d.data.name} error: ${errorMessage}\` **(line: ${funcLine})**`)
          .replaceAll("{line}", `${funcLine}`)
          .replaceAll("{function}", d.data.name)
          .replaceAll("{errorMessage}", errorMessage)
      : `\`${d.data.name} error: ${errorMessage}\` **(line: ${funcLine})**`;

    // Handle error output
    if (suppressErrors !== false && suppressErrors !== undefined) {
      d.data.datas.isError = true;
      if (d.channel) {
        d.channel.send(output);
      }
      return;
    }

    if (!d.msg?.channel) {
      d.data.datas.isError = true;
      console.error(output);
    } else {
      d.data.datas.isError = true;
      d.msg.channel.send(output);
    }
  }

  // Prepare data object for the function
  let messageInstance = message?.msg || message;
  let commandArgs = messageInstance?.content
    ?.replace(client?.prefix, "")
    .replace(name, "")
    ?.trim();

  const context = {
    db,
    data,
    msg: messageInstance,
    message: messageInstance,
    author: messageInstance?.author,
    channel: messageInstance?.channel,
    guild: messageInstance?.guild,
    member: messageInstance?.member,
    mentions: messageInstance?.mentions,
    client,
    cmd: name,
    error,
    this: real,
    sendError: handleError,
    util,
    arg: commandArgs,
  };

  // Execute the function
  try {
    const funcName = data.name.toLowerCase();
    const func = real.functions.get(funcName);
    if (!func) {
      throw new Error(`Function "${funcName}" not found.`);
    }

    return await func(context);
  } catch (e) {
    handleError(data, e.message || e.toString());
  }
};
