module.exports = async (cod, name, db, msg, client, real, DaTa) => {
  const readFunc = real.funcParser;
  let code = cod;
  let split = typeof code === "string" ? code.split("$") : [];

  let Fin = [];

  // Search for functions
  function search(functions) {
    for (const f of functions) {
      let func = readFunc.filter((ff) =>
        ff.localeCompare(("$" + f).slice(0, ff.length), undefined, {
          sensitivity: "accent",
        }) === 0
      );
      if (func.length === 1) {
        Fin.push(func[0]);
      } else if (func.length > 1) {
        Fin.push(func.sort((a, b) => b.length - a.length)[0]);
      }
    }
    return Fin;
  }

  if (typeof code === "string") {
    var datas = DaTa || {
      isError: false,
      suppressErrors: false,
    };

    datas.isError = datas.isError === undefined ? false : datas.isError;
    datas.suppressErrors = datas.suppressErrors === undefined ? false : datas.suppressErrors;

    let functions = search(split).reverse();

    for (const func of functions) {
      const regEscape = (v) => v.replace(/[-[{}()*+?.,\\^$|#\s]/g, "\\$&");
      let hasBracket = true;

      // Extract parameters
      let params = code.split(new RegExp(regEscape(func), "gi"));
      params = params[params.length - 1];
      let param = params;
      let a = 0;

      if (!params.startsWith("[")) {
        params = "";
        hasBracket = false;
      } else {
        for (let i = 0; ; i++) {
          if (param.charAt(i) === "[") {
            a++;
          } else if (param.charAt(i) === "]") {
            a--;
          }
          if (a <= 0 || i > param.length) {
            param = i - 1;
            break;
          }
        }
        params = params.substring(1, param + 1);
      }

      // Nested function parsing
      while (params.includes("$")) {
        const nestedFunctions = search(params.split("$"));
        for (const nestedFunc of nestedFunctions) {
          const nestedParams = params.split(new RegExp(regEscape(nestedFunc), "gi"))[1]?.match(/(.*?)/)?.[1] || "";
          const replacer = await require("../funcs/replacer.js")({
            name: nestedFunc,
            inside: nestedParams,
            splits: nestedParams.split(/[;,|]/), // Multi-separator support
            all: `${nestedFunc}[${nestedParams}]`,
            datas: datas,
          }, name, db, msg, client, datas.isError, real);
          params = params.replace(`${nestedFunc}[${nestedParams}]`, replacer || "");
        }
      }

      let splitted = params.split(/[;,|]/); // Multi-separator support
      let replacer = await require("../funcs/replacer.js")({
        name: func,
        inside: params,
        splits: splitted.map((z) => (z === "" ? undefined : z)),
        all: hasBracket ? `${func}[${params}]` : func,
        datas: datas,
      }, name, db, msg, client, datas.isError, real);
      if (replacer === undefined) replacer = "";
      code = code.replace(hasBracket ? `${func}[${params}]` : func, replacer);
      if (datas.isError) break;
    }
  } else {
    let message = msg;
    let messagee = message?.msg || message?.message || message;
    let data = {};
    let all = {
      util: require("./utils/Util.js"),
      db: db,
      data: data,
      msg: messagee,
      message: messagee,
      author: message.author,
      channel: message.channel,
      guild: message.guild,
      member: message.member,
      mentions: message.mentions,
      client: client,
      cmd: name,
      error: msg.error,
      this: real,
    };
    let arg = all.msg?.content?.replace(all.client?.prefix, "").replace(all.cmd, "");
    arg = arg?.trim();
    all.arg = arg;
    code(all);
  }

  return code;
};