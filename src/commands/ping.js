module.exports = {
    name: "ping",
    exec: (msg) => {
        msg.channel.send(`🏓 Pong! \`${msg.client.ws.ping}ms\``);
    }
};
