const express = require("express");
const app = express();
app.use(express.json());
const users = [{
    name:"john",
    kidneys: [{
        healthy:false
    },{
        healthy:true
    }]
}]

app.get("/" , function(req,res){
    const johnKidneys = users[0].kidneys;
    const numberOfKidneys = johnKidneys.length;
    let numberOfHealthyKidneys = 0;
    for(let i = 0;i<johnKidneys.length;i++){
        if(johnKidneys[i].healthy){
            numberOfHealthyKidneys+=1;
        }
    }
    const numberOfUnHealthyKidneys = numberOfKidneys - numberOfHealthyKidneys;
    res.json({
        numberOfKidneys,
        numberOfHealthyKidneys,
        numberOfUnHealthyKidneys
    })
})
app.post("/" , function(req , res){
    const isHealthy = req.body.isHealthy;
    users[0].kidneys.push({
        healthy: isHealthy
    })
    res.json({
        msg:"Done!"
    })
})

app.put("/" , function(req ,res){
    for(let i =0;i<users[0].kidneys.length;i++){
        users[0].kidneys[i].healthy = true;
    }
    res.json({});
})
app.delete("/" , function(req ,res){
    if(isUnhealthykidney()){
        const newKidneys = [];
        for(let i =0;i<users[0].kidneys.length;i++){
            if(users[0].kidneys[i].healthy){
                newKidneys.push({
                    healthy:true
                })
            }
        }
        users[0].kidneys= newKidneys;
        res.json({msg : "done!"});
    }
    else {
        res.status(411).json({
            msg:"you have no unhealthy kidneys."
        })
    }
})
function isUnhealthykidney(){
    let atleastOne= false;
    for(let i =0;i<users[0].kidneys.length;i++){
        if(!users[0].kidneys[i].healthy){
            atleastOne = true;
        }
    }
    return atleastOne;
}

app.listen(3000);