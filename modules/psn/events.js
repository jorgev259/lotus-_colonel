module.exports = {
  reqs (client, db, moduleName) {
    return new Promise((resolve, reject) => {
      db.prepare('CREATE TABLE IF NOT EXISTS psn (user TEXT, psn TEXT, PRIMARY KEY (user))').run()
      resolve()
    })
  },
  config: {
    default: true
  },
  events: {
    async guildMemberAdd (client, db, moduleName, member) {
      console.log(member)
    }
  }
}
