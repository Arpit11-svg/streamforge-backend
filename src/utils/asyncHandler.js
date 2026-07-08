const asyncHandler = (fun) => async (req, res, next) => {
    try {
        return await fun(req, res, next)
    } catch (error) {

        console.error(error);          // <-- add this
        console.error(error.stack);    // <-- add this

        res.status(error.code || 500).json({
            success: false,
            message: error.message,
        })
    }
}

export {asyncHandler}