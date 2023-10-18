const jwt = require("jsonwebtoken")

class jwtToken{

    static generate(id , duration ){

        return jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: duration ,
        })

    }
}

module.exports = {jwtToken}