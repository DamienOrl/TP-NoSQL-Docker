const Redis = require('ioredis')
const redis = new Redis({
  port: 6379,
  host: "127.0.0.1",
  connectTimeout: 10000})

module.exports = {
  get: async (userId) => {
    //return db.get('SELECT rowid, * FROM users WHERE rowid = ?', userId)
    const val= await redis.hgetall(`users/${userId}`)
    console.log(val)
    return val
  },

  count: async () => {
    //return db.get('SELECT COUNT(*) as count FROM users')
    const val= await redis.scard(`users`)
    console.log(val)
    return { count: val}
  },

  getAll: async () => {
    //return db.all('SELECT rowid, * FROM users LIMIT ? OFFSET ?', limit, offset)
    const val= await redis.smembers(`users`)
    return val
  },

  insert: async (params) => {
    /*return db.run(
      'INSERT INTO users (pseudo, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)',
      params.pseudo,
      params.firstname,
      params.lastname,
      params.email,
      params.password
    )*/
    const pipeline = redis.pipeline()
    const key = `userId`;
    const userId = await redis.incr(key)
    console.log(userId);
     pipeline.hmset(`users/${userId}`, {
     pseudo: params.pseudo,
     firstname: params.firstname,
     lastname: params.lastname,
     email: params.email,
     password: params.password,
     userId: userId
     //npm bcrypt
    })
    pipeline.sadd('users', userId)
    await pipeline.exec()
  },



  update: async (userId, params) => {
    /*const possibleKeys = ['firstname', 'lastname', 'email', 'pseudo', 'password']

    let dbArgs = []
    let queryArgs = []
    for (key in params) {
      if (-1 !== possibleKeys.indexOf(key)) {
        queryArgs.push(`${key} = ?`)
        dbArgs.push(params[key])
      }
    }*/

    const pipeline = redis.pipeline()
    const key = `userId`;//require('uuid').v4()
    userId = await redis.incr(key)
    console.log(userId);
     pipeline.hmset(`users/${userId}`, {
     pseudo: params.pseudo,
     firstname: params.firstname,
     lastname: params.lastname,
     email: params.email,
     password: params.password,
     userId: userId
     //npm bcrypt
    })
    pipeline.sadd('users', userId)
    await pipeline.exec()



  /*  if (!queryArgs.length) {
      let err = new Error('Bad Request')
      err.status = 400
      return Promise.reject(err)
    }

    /*dbArgs.push(userId)
    dbArgs.unshift('UPDATE users SET ' + queryArgs.join(', ') + ' WHERE rowid = ?')*/

    return Redis.run.apply(db, dbArgs).then((stmt) => {
      if (stmt.changes === 0){
        let err = new Error('Not found')
        err.status = 404
        return Promise.reject(err)
      }

      return stmt
    })
  },

  remove: (userId) => {
    //return db.run('DELETE FROM users WHERE rowid = ?', userId)
    redis.hdel(`users/:${userId}`)
  }

}
