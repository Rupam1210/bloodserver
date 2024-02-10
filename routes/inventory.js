const express=require('express');
const { createInventory, getinventory, getinventory3, getdonars,  getallhospital, orgprofile, orgprofilehospital } = require('../controller/inventorycntroller');
const verify = require('../middleware/token');
const bloodgroupdata = require('../controller/Analytics');
 
const route=express();
route.post("/create",verify,createInventory)
// route.post("/create-in",verify,createINInventory)
// route.post("/create-out",verify,createoutInventory)
route.get("/getrecord",verify,getinventory)
route.get("/get-recent-record",verify,getinventory3)
route.get("/get-donars",verify,getdonars)
route.get("/get-hospital",verify,getallhospital)
route.get("/get-org",verify,orgprofile)
route.get("/get-org-hospital",verify,orgprofilehospital)
//routes for anyliticsbl
route.get("/anlytics",verify,bloodgroupdata)

module.exports=route