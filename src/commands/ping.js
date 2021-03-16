const util = require("../util");
module.exports = {
    name: "ping",
    exec: (msg) => {		
        const responseTime = Date.now() - msg.createdTimestamp;
        const apiLatency = msg.client.ws.ping;
        msg.channel.send(
            util.embed()
                .setDescription(`**Response Time**: ${responseTime}ms\n**API Latency**: ${apiLatency}ms`)
        );
    }
};
