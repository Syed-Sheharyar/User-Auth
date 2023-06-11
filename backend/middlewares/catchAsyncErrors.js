module.exports = (receiveFunc) => (req, res, next)=>{
    Promise.resolve(receiveFunc(req, res, next)).catch(next)
}