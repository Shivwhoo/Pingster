const asyncHandler=(requrestHandler)=>{
    return(req,res,next)=>{
        Promise
        .resolve(requrestHandler(req,res,next))
        .catch((err)=>next(err))
    }
}

export {asyncHandler}