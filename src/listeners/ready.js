module.exports = {
    name: "ready",
    exec: async (client) => {
        console.log(`Logged in as ${client.user.tag}`);

        const nodes = [...client.manager.nodes.values()];
        for (const node of nodes) {
            try {
                await node.connect();
            } catch (e) {
                client.manager.emit("error", e, node);
            }
        }
    }
};
