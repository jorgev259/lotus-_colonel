module.exports.commands = {
  psn: {
    desc: 'Modifies your personal role to display your PSN.',
    usage: 'psn PSN_HERE',
    async execute (client, msg, param, db) {
      if (!param[1]) return msg.channel.send('You need to specify your PSN. >psn PSN_HERE')

      let psn = param.slice(1).join(' ')
      let entry = db.prepare('SELECT role FROM psn WHERE user = ?').get(msg.author.id)

      try {
        let role = await msg.guild.roles.fetch(entry.role)
        await role.edit({ name: psn })
        db.prepare('UPDATE psn SET psn = ? WHERE user = ?').run(psn, msg.author.id)
        msg.channel.send('Change successful!')
      } catch (err) {
        msg.channel.send('Something went wrong')
        console.log(err)
      }
    }
  }
}
