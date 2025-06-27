import { exec } from "child_process";
import util from "util";
import config from "../../config.cjs";

const execPromise = util.promisify(exec);

// Déclaration des alias du nom de la commande
const aliases = ["update", "up", "upgrade", "maj"];

const update = async (m, sock) => {
  try {
    const prefix = config.PREFIX;
    const botName = config.BOT_NAME || "INCONNU XD V2";
    const devName = config.OWNER_NAME || "INCONNU BOY TECH";

    const body = m.body || "";
    const cmd = body.startsWith(prefix)
      ? body.slice(prefix.length).split(" ")[0].toLowerCase()
      : "";

    // Vérifie si la commande utilisée fait partie des alias
    if (!aliases.includes(cmd)) return;

    await m.reply("🔄 Checking for updates, please wait...");

    const { stdout, stderr } = await execPromise("git pull");

    if (stderr) {
      return m.reply(`❌ *Update failed!*\n\nError:\n\`\`\`${stderr}\`\`\``);
    }

    let msg = `🌐 *${botName} Update Result*\n`;
    msg += `╭───────────────⭓\n`;
    msg += `│ 🤖 *BOT:* ${botName}\n`;
    msg += `│ 👑 *DEV:* ${devName}\n`;
    msg += `│ 🛠️ *Update Status:* Success\n`;
    msg += `╰───────────────⭓\n`;
    msg += `\n📄 *Git Response:*\n\`\`\`${stdout.trim()}\`\`\`\n`;
    msg += `\n✅ *Done! Use \`${prefix}restart\` to reload the bot.*`;

    await sock.sendMessage(m.from, {
      image: { url: 'https://files.catbox.moe/e1k73u.jpg' },
      caption: msg.trim(),
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
      }
    }, { quoted: m });

  } catch (error) {
    console.error("Update Error:", error);
    return m.reply(`❌ *Error while updating:*\n\`\`\`${error.message}\`\`\``);
  }
};

export default update;
