/*const env = require("dotenv").config()
const express = require("express")
const{connectToDb, getDb} = require("./db")
const { ObjectId } = require("mongodb")

const app = express()
app.use(express.json())

let db

connectToDb((err)=>{
    if(!err){
       
app.listen(5000, ()=>{
    console.log(`listening on ${5000}`)
})
db = getDb()
    }
})




app.get("/data", (req, res) => {

    db.collection("myCollection")
    .find()
    .sort({ id: 1 })
    .toArray() // Convert the cursor to an array
    .then((result) => {
      dataItem = result;
      res.status(200).json({ dataItem: `The items were fetched successfully`, result });
    })
    .catch((err) => {
      res.status(500).json({ err: `could not fetch the data`  });
    });



  });




app.get("/data/:id", (req,res)=> {
    if(ObjectId.isValid(req.params.id)){

        db.collection("myCollection")
        //  const idObject = new ObjectId(req.params.id)
          .findOne({_id : new ObjectId(req.params.id) } )
          .then((items)=>{
            if(items){
              res.status(200).json(items)
            }
            else{
              res.status(404).json({error: `An  error occur`      })
            }
          
          }).catch((error)=>
              res.status(400).json({error :` An error occur in your request`})
          )



    }else{
        res.status(500).json({error: `a malfunction of the server occur`})
    }





} )

app.post("/data",(req, res)=>{
    const data = req.body
    db.collection("myCollection")
    .insertOne(data)
    .then((doc)=>{
        if(!doc){
            res.status(400).json({err: "Unable to access the data from the database "})
        }
      else{
        res.status(200).json(doc)
      }
    }).catch((err)=>{
        res.status(500).json({err: `could not fetch the data`})
    } )

   
})

app.delete("/data/:id", (req,res)=>{
    if(ObjectId.isValid(req.params.id)){
        db.collection("myCollections")
        .deleteOne({_id: new ObjectId(req.params.id)})
        .then((doc)=>{
            res.status(200).json(doc)
        }).catch((err)=>{
            res.status(400).json({err:`An error occurred while deleting the file`})
        })
    }else{
        res.status(500).json({err:"not successful"})
    }
})



app.patch("/data/:id", (req, res)=>{
    if(ObjectId.isValid(req.params.id)){
        const update = req.body
        db.collection("myCollection")
        .updateOne({_id : new ObjectId(req.body.id)}, { $set:update})
        .then((result)=>{
          if(result){
            res.status(200).json(result)
          }
          else{
            res.status(404).json({message:`couldn't update the file`})
          }
        }).catch((err)=>{
            res.status(500).json({message:err.message})
        })
    }
})

let dataItem ;

app.get("/data", (req, res)=>{
    const page = parseInt(req.query.p) || 1
 // const page = req.b.p || 0
    const pageSize = parseInt(req.query.s) || 3
   // const pageSize = 3
  const skip =(page - 1)* pageSize

  console.log('Page:', page);
  console.log('PageSize:', pageSize);
  console.log('Skip:', skip);

    db.collection("myCollection")
    .find()
    .sort({_id: 1})
    .skip(skip)
    .limit(pageSize)
    .then((result)=>{
      if(result> 0){
        res.status(200).json(result)
      }else{
        res.status(404).json({message: "unable to fetch data"})
      }
    }).catch((err)=>{
        res.status(500).json({message: "failed to fetch data"})
    })
    
})*/

