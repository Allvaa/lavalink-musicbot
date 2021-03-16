const util = require("../util");
module.exports = {
    name: "ping",
    exec: (msg) => {		
        const responseTime = (Date.now() - msg.createdTimestamp).toFixed(0);
        const apiLatency = msg.client.ws.ping;
        msg.channel.send(util.embed()
            .addField("Response Time", responseTime, true)
            .addField("API Latency", apiLatency, true)
        );
    }
};
