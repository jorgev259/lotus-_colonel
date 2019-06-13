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
    async ready (client, db) {
      let guild = client.guilds.first()
      let members = await guild.members.fetch()
      await guild.roles.fetch()

      members.forEach(member => {
        try {
          let entry = db.prepare('SELECT * FROM psn WHERE user=?').get(member.id)
          if (entry) {
            if (guild.roles.some(r => r.name === entry.psn)) member.roles.add(guild.roles.find(r => r.name === entry.psn))
            else {
              let rolePos = guild.roles.find(r => r.name === '// PSN Colors')
              member.guild.roles.create({ data: { name: member.user.username, position: rolePos.position - 1 } }).then(role => {
                db.prepare('INSERT INTO psn (user,psn,role) VALUES (?,?,?)').run(member.id, member.user.username, role.id)
                member.roles.add(role)
              })
            }
          } else {
            if (guild.roles.some(r => r.name === entry.psn)) {
              let role = guild.roles.find(r => r.name === entry.psn)
              db.prepare('INSERT INTO psn (user,psn,role) VALUES (?,?,?)').run(member.id, member.user.username, role.id)
              member.roles.add(role)
            } else {
              let rolePos = guild.roles.find(r => r.name === '// PSN Colors')
              member.guild.roles.create({ data: { name: member.user.username, position: rolePos.position - 1 } }).then(role => {
                db.prepare('INSERT INTO psn (user,psn,role) VALUES (?,?,?)').run(member.id, member.user.username, role.id)
                member.roles.add(role)
              })
            }
          }
        } catch (err) {
          console.log(err)
          console.log(member)
        }
      })
    },
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
