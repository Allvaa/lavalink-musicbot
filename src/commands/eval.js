const { inspect } = require("util");

module.exports = {
    name: "eval",
    aliases: ["e"],
    exec: async (msg, args) => {
        if (msg.author.id !== process.env.OWNER_ID) return;
        const isAsync = args.includes("--async");
        const isSilent = args.includes("--silent");
        const code = args.filter(e => !/^--(async|silent)$/.test(e)).join(" ");
        try {
            let result = eval(isAsync ? `(async()=>{${code}})()` : code);
            let isResultPromise = false;
            if (result instanceof Promise) {
                result = await result;
                isResultPromise = true;
            }
            if (isSilent) return;
            let inspectedResult = inspect(result, { depth: 0 });
            if (isResultPromise) inspectedResult = `Promise<${inspectedResult}>`;
            msg.channel.send(`${isURL(inspectedResult) ? inspectedResult : `\`\`\`js\n${inspectedResult}\`\`\``}`);
        } catch (e) {
            msg.channel.send(`\`\`\`js\n${e}\`\`\``);
        }
    }
};

function isURL(url) {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
}
