module.exports = {
    name: "ping",
    exec: (ctx) => {		
        ctx.respond(`🏓 Pong! \`${ctx.client.ws.ping}ms\``);
    }
};
