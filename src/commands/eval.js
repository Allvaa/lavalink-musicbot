const { inspect } = require("util");
const { isValidURL } = require("../util");

module.exports = {
    name: "eval",
    description: "Evaluate JS code",
    aliases: ["e"],
    exec: async (ctx) => {
        if (ctx.author.id !== process.env.OWNER_ID) return;
        const isAsync = ctx.args.includes("--async");
        const isSilent = ctx.args.includes("--silent");
        const code = ctx.args.filter(e => !/^--(async|silent)$/.test(e)).join(" ");
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
            await ctx.respond(`${isValidURL(inspectedResult) ? inspectedResult : `\`\`\`js\n${inspectedResult}\`\`\``}`);
        } catch (e) {
            ctx.respond(`\`\`\`js\n${e}\`\`\``);
        }
    }
};
