const express=require('express');
const verify = require('../middleware/token');
const { createReq, getreqdonar, getreq, getreqhospital, reject, accept } = require('../controller/requestController');
const Route=express();
 Route.post("/create",verify,createReq)
 Route.get("/get-req",verify,getreqdonar)
 //organisation
 Route.get("/get-orgreq",verify,getreq)
 //hospital
 Route.get("/get-hos-req",verify,getreqhospital)
 //reject
 Route.get("/req-reject/:id",verify,reject)
 Route.get("/req-accept/:id",verify,accept)
 
module.exports=Route