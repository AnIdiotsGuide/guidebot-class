const Command = require("../base/Command.js");
const Enmap = require("enmap");
let tags;

class Tags extends Command {
  constructor(client) {
    super(client, {
      name: "tags",
      description: "Latency and API response times.",
      usage: "tags <tag name>",
      aliases: ["tag"]
    });

    this.init = async () => {
      tags = new Enmap({ name: "tags", persistent: true });
    };

    this.shutdown = async () => {
      await tags.close();
    };
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      if (message.flags.length < 1) {
        const name = args[0];
        if (tags.has(name)) {
          const tag = tags.get(name);
          await message.channel.send(tag);
          return;
        }
      }
    
      const [name, ...content] = args;
      let answer;
      switch (message.flags[0]) {
        case "list":
          answer = [`**\`List of Available Tags\`**\n\`\`\`${tags.keyArray().map(key => `+${key}`).join(" ")}\`\`\``, null];
          break;
        case "add":
          if (tags.has(name)) return message.channel.send("That tag already exists");
          if (["eval", "tag", "list"].includes(name)) return message.reply("Cannot use reserved tag names.");
          tags.set(name, content.join(" "));
          answer = [null, "☑"];
          break;
        case "del":
          if (tags.has(name)) {
            tags.delete(name);
            answer = [null, "☑"];
          } else {
            answer = ["Tag name not found", null];
          }
          break;
        case "edit":
          if (tags.has(name)) {
            tags.set(name, content.join(" "));
            answer = [null, "☑"];
          } else {
            answer = ["Tag name not found", null];
          }
          break;
        case "rename":
          if (tags.has(name)) {
            const newName = content[0];
            const oldTag = tags.get(name);
            tags.set(newName, oldTag);
            tags.delete(name);
            answer = [null, "☑"];
          } else {
            answer = ["Tag name not found", null];
          }
          break;
        default:
          answer = [null, "⁉"];
      }
      if (answer[0]) message.channel.send(answer[0]);
      if (answer[1]) message.react(answer[1]);
    
    
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Tags;
