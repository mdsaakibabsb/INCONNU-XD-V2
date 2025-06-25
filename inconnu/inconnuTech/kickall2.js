import config from '../../config.cjs';

const kickAll2 = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    if (cmd !== 'kickall2') return; // Only proceed if the command is 'kickall2'
    if (!m.isGroup) return m.reply("*This command can only be used in groups*");

    const groupMetadata = await gss.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const botAdmin = participants.find(p => p.id === botNumber)?.admin;
    const senderAdmin = participants.find(p => p.id === m.sender)?.admin;

    if (!botAdmin) return m.reply("*Bot must be an admin to use this command*");
    if (!senderAdmin) return m.reply("*You must be an admin to use this command*");

    // Filter non-admin members
    const users = participants.filter(p => !p.admin).map(p => p.id);

    if (users.length === 0) {
      return m.reply("*No users to kick*");
    }

    m.reply(`⚠️ INCONNU XD IS CLEANING... ${users.length} user(s) will be removed one by one.`);

    // Remove each user one by one
    for (const user of users) {
      try {
        await gss.groupParticipantsUpdate(m.from, [user], 'remove');
        await gss.sendMessage(m.from, {
          text: `INCONNU XD kicked @${user.split('@')[0]} ⚰️`,
          mentions: [user]
        });
        await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 sec between each kick
      } catch (e) {
        console.log(`Failed to kick ${user}:`, e);
      }
    }

    m.reply("✅ Kickall2 complete. INCONNU XD has finished the purge.");
  } catch (error) {
    console.error('Error in kickall2:', error);
    m.reply('An error occurred while executing kickall2.');
  }
};

export default kickAll2;
