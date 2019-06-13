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
      let count = 0

      let promises = guild.roles.filter(r => r.position > 0 && r.position < 39).map(function (r) {
        try {
          return r.delete()
        } catch (e) { console.log(e) }
      })
      await Promise.all(promises)
      console.log('done')
      /* members.forEach(member => {
        let rolePos = guild.roles.find(r => r.name === '// PSN colors')
        member.guild.roles.create({ data: { name: member.user.username, position: rolePos.position - 1} }).then(role => {
          db.prepare('INSERT INTO psn (user,psn,role) VALUES (?,?,?)').run(member.user.username, member.user.username, role.id)

          count++
          console.log(`${count}/${members.size}`)
          process.exit(1)
        })
      }) */
    },
    async guildMemberAdd (client, db, moduleName, member) {
      member.guild.roles.create({ data: { name: member.user.username } }).then(role => {
        db.prepare('INSERT INTO psn (user,psn,role) VALUES (?,?,?)').run(member.user.username, member.user.username, role.id)
      })
      member.guild.systemChannel.send(`Welcome to The Disflavored, ${member}`)

      console.log(member)
    }
  }
}
