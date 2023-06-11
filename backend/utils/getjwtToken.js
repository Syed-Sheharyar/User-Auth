// Create token and saving to cookie
const getToken = async (user, statusCode, res)=>{
    const token = user.getJWTtoken()
 
    // option for cookie
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    res.status(statusCode).cookie("token", token, options).json({success: true, user, token})
}

module.exports = getToken