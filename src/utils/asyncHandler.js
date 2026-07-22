const asyncHandler = (fun) => async (req, res, next) => {
    try {
        return await fun(req, res, next)
        
    } catch (error) {

        res.status(error.statusCode  || 500).json({
            success: false,
            message: error.message,
        })
    }
}

export {asyncHandler}