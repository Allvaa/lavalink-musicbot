const { Constants } = require("discord.js");
const { readdirSync } = require("fs");
const { resolve, join } = require("path");
const petitio = require("petitio");

require("dotenv").config({
    path: resolve(__dirname, ".env")
});

process.argv[2] === "dev" ? console.log(`Running with dev arg. commands will only registered to dev guild (${process.env.DEV_GUILD})`) : console.log("Registering commands globally");

const baseURL = "https://discord.com/api/v9";

const commandsDir = resolve("src", "commands");
const commands = readdirSync(commandsDir)
    .map(cmdFile => require(resolve(commandsDir, cmdFile)))
    .map(({ name, description, options }) => ({
        name,
        description,
        options: Object.entries(options ?? {})
            .map(([name, { description, type, required }]) => ({
                name,
                description,
                type: Constants.ApplicationCommandOptionTypes[type],
                required
            }))
    }));

(async () => {
    const res = await petitio(baseURL, "PUT")
        .body(commands)
        .header("Authorization", `Bot ${process.env.TOKEN}`)
        .path(join("applications", process.env.ID, ...(process.argv[2] === "dev" ? ["guilds", process.env.DEV_GUILD] : []), "commands"))
        .send();
    
    if (!(res.statusCode >= 200 && res.statusCode < 300)) {
        console.log(res.json());
        return;
    }

    console.log(res.json().map((x, i) => `${++i}. ${x.name} registered`).join("\n"));
})();
