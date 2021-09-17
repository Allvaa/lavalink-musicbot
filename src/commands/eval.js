const { inspect } = require("util");
const { isValidURL } = require("../util");

module.exports = {
    name: "eval",
    description: "Evaluate JS code",
    aliases: ["e"],
    options: {
        code: {
            description: "Code to eval",
            type: "STRING",
            required: true
        },
        async: {
            description: "Async eval",
            type: "BOOLEAN",
        },
        silent: {
            description: "Dont send output",
            type: "BOOLEAN",
        }
    },
    exec: async (ctx) => {
        if (ctx.author.id !== process.env.OWNER_ID) return;
        console.log(ctx.options);
        const { code, async: isAsync, silent: isSilent } = ctx.options;
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
