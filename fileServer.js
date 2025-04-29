const express = require('express');
const fs = require('fs');
const path = require("path");
const app = express();

app.get("/files" , function(req , res){
    //Path to 'files' directoryPath = directory /Users/nikhilkumar/VSCODE/o-1/http_server1/files
    const directoryPath = path.join(__dirname , 'files');  

    fs.access(directoryPath , fs.constants.F_OK , function(err){
        // if files folder doesn't exist then we have 2 options 
        // 1. send error directly
        // 2. create a folder names files
        // we are going to use option 2 and create files directory
        if(err){
            fs.mkdir(directoryPath , function(err){
                if(err){
                    return res.status(500).json({ error: 'Unable to create files directory' });
                }
                console.log('Files directory created');
                res.status(200).json({ message: 'Files directory was created' });
            })
        }
        else{
            fs.readdir(directoryPath , function(err , files){
                if(err){
                    return res.status(500).json({ error: 'Unable to scan directory' });
                }
                res.status(200).json(files);
            })
        }
    })

})

app.get("/files/:filesname" , function(req, res){
    const name = req.params.filesname; //req.params allows us to dynamically use any names used in url
    const filePath = path.join(__dirname, 'files', name);
    console.log(name);
    console.log(filePath);
    fs.readFile(filePath , "utf-8" , function(err,data){
        if (err) {
            return res.status(404).json({ error: 'File not found', details: err.message });
        }
        res.json({
            data
        })
    })
})

app.listen(3001);

