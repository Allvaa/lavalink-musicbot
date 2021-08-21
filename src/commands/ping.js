module.exports = {
    name: "ping",
    description: "WS latency",
    exec: (ctx) => {		
        ctx.respond(`🏓 Pong! \`${ctx.client.ws.ping}ms\``);
    }
};
