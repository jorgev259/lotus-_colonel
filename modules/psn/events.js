module.exports = {
  reqs (client, db, moduleName) {
    return new Promise((resolve, reject) => {
      db.prepare('CREATE TABLE IF NOT EXISTS psn (user TEXT, psn TEXT, role TEXT, PRIMARY KEY (user))').run()
      resolve()
    })
  },
  config: {
    default: true
  },
  events: {
    async guildMemberAdd (client, db, moduleName, member) {
      await member.guild.roles.fetch()
      let rolePos = member.guild.roles.find(r => r.name === '// PSN Colors')
      member.guild.roles.create({ data: { name: member.user.username, position: rolePos.position - 1 } }).then(role => {
        db.prepare('INSERT INTO psn (user,psn,role) VALUES (?,?,?)').run(member.id, member.user.username, role.id)
        member.roles.add(role)
      })
      member.guild.systemChannel.send(`Welcome to The Disflavored, ${member}`)
    }
  }
}
