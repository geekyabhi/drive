const Folder = require("../models/folderModel")

const createFolder=async(req,res)=>{
    try{
        const {name,parentFolder}=req.body
        const folder=await Folder.findById(parentFolder)
        const prevArray=folder.childFolder
        let flag=0
        prevArray.forEach(element => {
            if(element.name===name)
                flag=1
        });
        if(flag){
            return res.status(200).json({
                status: false,
                error: 'Folder with that name already exists'
            })
        }
        else {
                const folder=await Folder.create({name,parentFolder,childFolder:[],childFiles:[],user:req.user._id})
                const newFolder = {
                    name:folder.name,
                    folder:folder._id
                }
                const newArray = [...prevArray, newFolder]
                const updatedFolder = await Folder.findByIdAndUpdate(parentFolder, { childFolder: newArray })
                return res.status(201).json({
                    success: true,
                    data: folder
                })
        }

    }catch(e){
        if (e.name === 'ValidationError') {
            console.log(e)
            const messages = Object.values(e.errors).map(val => val.message)
            res.status(400).json({
                success: false,
                error: messages
            })

        } else {
            console.log(`Error occured ${e}`)
            return res.status(500).json({
                success: false,
                error: `${e}`
            })
        }
    }
}

const copyFolder=async(req,res)=>{
    try {
        const folderToBeCopyId=req.params.id
        const destinationParentFolderId=req.body.parentFolder
        const folderTobeCopy=await Folder.findById(folderToBeCopyId)
        const destinationParentFolder=await Folder.findById(destinationParentFolderId)

        if(String(folderTobeCopy.user)!==String(req.user._id)){
            return res.status(200).json({
                success:false,
                error:'Not authorized'
            })
        }        

        let flag=0
        destinationParentFolder.childFolder.forEach(folder => {
            if(folder.name===folderTobeCopy.name)
                flag=1
        })
        if(flag){
            return res.status(400).json({
                status: false,
                message: 'Folder  with that name already exists'
            })
        }else{

            let obj={
                name:folderTobeCopy.name,
                user:folderTobeCopy.user,
                childFolder:folderTobeCopy.childFolder,
                childFiles:folderTobeCopy.childFiles,
                parentFolder:destinationParentFolderId,
            }
            const newFolder=await Folder.create(obj)
            const childFolder=destinationParentFolder.childFolder
            await Folder.findByIdAndUpdate(destinationParentFolderId,{childFolder:[...childFolder,{name:folderTobeCopy.name,folder:folderToBeCopyId}]})
            return res.status(201).json({
                success: true,
                data:newFolder
            })
        }
    } catch (e) {
        if (e.name === 'ValidationError') {
            // console.log(e)
            const messages = Object.values(e.errors).map(val => val.message)
            res.status(400).json({
                success: false,
                error: messages
            })
        } else {
            // console.log(`Error occured ${e}`)
            return res.status(500).json({
                success: false,
                error: `${e}`
            })
        }
    }
}

const moveFolder=async(req,res)=>{
    try{
        const folderTobeMovedId=req.params.id
        const destinationParentFolderId=req.body.parentFolder
        const folderToBeMoved=await Folder.findById(folderTobeMovedId)
        const destinationParentFolder=await Folder.findById(destinationParentFolderId)
        const currentParentFolder=await Folder.findById(folderToBeMoved.parentFolder)

        if(String(folderToBeMoved.user)!==String(req.user._id)){
            return res.status(200).json({
                success:false,
                error:'Not authorized'
            })
        }

        let flag=0
        destinationParentFolder.childFolder.forEach(folder => {
            if(folder.name===folderToBeMoved.name)
                flag=1
        })
        if(flag){
            return res.status(400).json({
                status: false,
                message: 'Folder  with that name already exists'
            })
        }else{
            const newCurrentParentFolderArray=currentParentFolder.childFolder.filter((obj)=>String(obj.folder)!==String(folderTobeMovedId))

            const childFolder=destinationParentFolder.childFolder

            await Folder.findByIdAndUpdate(destinationParentFolderId,{childFolder:[...childFolder,{name:folderToBeMoved.name,folder:folderTobeMovedId}]})

            const oldParentFolder=await Folder.findByIdAndUpdate(folderToBeMoved.parentFolder,{childFolder:newCurrentParentFolderArray})
            const file=await Folder.findByIdAndUpdate(req.params.id,{parentFolder:destinationParentFolderId})
            return res.status(201).json({
                success: true,
                data:file
            })
        }

    }catch(e){
        if (e.name === 'ValidationError') {
            console.log(e)
            const messages = Object.values(e.errors).map(val => val.message)
            res.status(400).json({
                success: false,
                error: messages
            })

        } else {
            console.log(`Error occured ${e}`)
            return res.status(500).json({
                success: false,
                error: `${e}`
            })
        }
    }
}

const deleteFolder=async(req,res)=>{
    try{
        const folderTobeDeletedId=req.params.id
        const folderTobeDeleted=await Folder.findById(folderTobeDeletedId)
        const parentFolderId=folderTobeDeleted.parentFolder
        const parentFolder=await Folder.findById(parentFolderId)
        if(String(folderTobeDeleted.user)!==String(req.user._id)){
            return res.status(200).json({
                success:false,
                error:'Not authorized'
            })
        }
        const childFolder=parentFolder.childFolder
        parentFolder.childFolder=childFolder.filter((obj)=>String(obj.folder)!==String(folderTobeDeletedId))
        await parentFolder.save()
        await folderTobeDeleted.remove()
        return res.status(201).json({
            success: true,
            data:'Successfully deleted'
        })
    }catch(e){
        if (e.name === 'ValidationError') {
            console.log(e)
            const messages = Object.values(e.errors).map(val => val.message)
            res.status(400).json({
                success: false,
                error: messages
            })

        } else {
            console.log(`Error occured ${e}`)
            return res.status(500).json({
                success: false,
                error: `${e}`
            })
        }
    }
}

const getParentFolder=async(req,res)=>{
    try{
        const user=req.user._id
        
        if(String(user)!==String(req.params.id)){
            res.status(404).json({success:false,error:'Not authorized'})
            return
        }
        const parentFolder=user
        const folder=await Folder.findOne({user,parentFolder})
        res.status(201).json({success:true,data:folder})
    }catch(e){
        console.log(e)
        res.status(404).json({success:false,error:'Server error'})
    }
}

const getFolder=async (req,res)=>{
    try{
        const {id}=req.params
        console.log(id)
        const user=req.user._id
        const folder=await Folder.findById(id)
        if(!folder){
            return res.status(200).json({
                success:false,
                error:'No Such folder found'
            })
        }
        if(String(folder.user)!==String(user)){
            return res.status(200).json({
                success:false,
                error:'Not authorized'
            })
        }
        if(!user){
            return res.status(200).json({
                success:false,
                error:'Not authorized'
            })
        }
        res.send({
            success:true,
            data:folder
        })
    
    }catch(e){
        console.log(e)
        res.status(404).json({success:false,error:'Server error'})
    }
}

module.exports={createFolder,copyFolder,moveFolder,deleteFolder,getParentFolder,getFolder}