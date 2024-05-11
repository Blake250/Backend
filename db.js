/*const {MongoClient} = require("mongodb")
const env = require("dotenv").config()



let dbConnection


module.exports = {
    connectToDb: (cb)=>{
     MongoClient.connect("mongodb://Blake250:Benzeman250@localhost:27017/?authMechanism=DEFAULT")
     //  MongoClient.connect(process.env.MONGO_URI)
        .then((client)=>{
           dbConnection = client.db()
           return cb()
        }).catch((err)=>{
            console.log(err)
            return cb(err)
        })

    },
    getDb:()=> {
        return dbConnection
    }
        

    
}*/