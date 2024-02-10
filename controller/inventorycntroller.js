const mongoose=require('mongoose')
const User=require('../model/Usermodal') 
const inventory = require('../model/inventory')

const createInventory=async(req,res)=>{
    try {
        const user=await User.findOne({email:req.body.email})
        if(!user)return res.status(200).send({
            success:false,
            message:"user not found"
        })
      
        if(req.body.inventoryType==="out"){
            const requestedBloodGroup = req.body.bloodGroup;
            const requestedQuantityOfBlood = req.body.quantity;
             
            //calculate Blood Quanitity
            
            const organisation = new mongoose.Types.ObjectId(req.body?.userId);
            // console.log(Organisation)
            // console.log(organisation)
            const totalInOfRequestedBlood = await inventory.aggregate([
                {
                $match: {
                    bloodGroup: requestedBloodGroup,
                    inventoryType:"in",
                     organisation
                },
                },
                {
                $group: {
                    _id:`$bloodGroup`,
                    total: { $sum: "$quantity" },  
                }
                }
            ]);
            // console.log("Total In", totalInOfRequestedBlood);
            const totalIn = totalInOfRequestedBlood[0]?.total || 0;
            //calculate OUT Blood Quanitity

            const totalOutOfRequestedBloodGroup = await inventory.aggregate([
                {
                $match: {
                    organisation,
                    inventoryType: "out",
                    bloodGroup: requestedBloodGroup,
                },
                },
                {
                $group: {
                    _id: "$bloodGroup",
                    total: { $sum: "$quantity" },
                },
                }, 
            ]);
            const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

            //   in & Out Calc
            const availableQuanityOfBloodGroup = totalIn - totalOut;
            //   quantity validation
            if(availableQuanityOfBloodGroup < requestedQuantityOfBlood){
                return res.status(200).send({
                    success: false,
                    message: `Only ${availableQuanityOfBloodGroup}ML of ${requestedBloodGroup.toUpperCase()} is available`,
                });
            }
            req.body.hospital=user?._id;
        }else{
            req.body.donar=user?._id;
          
        }
        
        const invent=await new inventory(req.body);
        await invent.save();
        return res.status(200).send({
            success:true,
            message:"New record created",
            invent
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message:"Error in inventory",
            success:false,
            error
        }) 
    }
}
//

const getinventory=async(req,res)=>{
    try {
        const invent=await inventory.find({
            organisation:req.body.userId
        }).populate("donar").populate("hospital").sort({createdAt:-1})
        return res.status(200).send({
            success:true,
            message:" Get All records succesfull",
            invent
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in Get all API",  
            error
        }) 
    }
}
//all hospital record
const gethosiptal=async(req,res)=>{
    try {const inventory = await inventoryModel
        .find(req.body.filters)
        .populate("donar")
        .populate("hospital")
        .populate("organisation")
        .sort({ createdAt: -1 });
      return res.status(200).send({
        success: true,
        messaage: "get hospital comsumer records successfully",
        inventory,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Error In Get consumer Inventory",
        error,
      });
    }
} 
//limit of 3
const getinventory3=async(req,res)=>{
    try {
        const invent=await inventory.find({
            organisation:req.body.userId
        }).limit(3).sort({createdAt:-1})
        return res.status(200).send({
            success:true,
            message:" recent records succesfull",
            invent
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in recent API",  
            error
        })
    }
}
//donar records

const getdonars=async(req,res)=>{
    try {
        const donarId=await inventory.distinct("donar",{
            organisation:req.body.userId
        }) ;
        const donars=await User.find({_id:{$in:donarId}});
        return res.status(200).send({
            success:true,
            message:" All donar records succesfull",
            donars
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in recent API",  
            error
        })
    }
}
//hospitAL DETails
const getallhospital=async(req,res)=>{
    try {
        const hospitalId=await inventory.distinct("hospital",{
            organisation:req.body.userId
        }) ;
        const hospitals=await User.find({_id:{$in:hospitalId}});
        return res.status(200).send({
            success:true,
            message:" All hospital records succesfull",
            hospitals
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in hospital API",  
            error
        })
    }
}
//org profile for donar
const orgprofile=async(req,res)=>{
    try {
        
        const donar=req.body.userId;
        const orgId=await inventory.distinct("organisation",{donar})
        const orgprofile=await User.find({_id:{$in:orgId}})
        return res.status(200).send({
            success:true,
            message:"successfully fecth org profile",
            orgprofile
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in donar API",  
            error
        })
    }
}
//org prodile for hospital
const orgprofilehospital=async(req,res)=>{
    try {
        const hospital=req.body.userId;
        const orgId=await inventory.distinct("organisation",{hospital})
        const orgprofile=await User.find({_id:{$in:orgId}})
        return res.status(200).send({
            success:true,
            message:"successfully fecth org profile",
            orgprofile
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in hospital API",  
            error
        })
    }
}

 
module.exports={createInventory,getinventory,gethosiptal,getinventory3,getdonars,getallhospital,orgprofile,orgprofilehospital}         