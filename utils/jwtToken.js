const jwt = require("jsonwebtoken")

class jwtToken{

    static generate(id , duration ){

        return jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: duration ,
        })
    }

    static verify(token, secret) {
        return jwt.verify(token, secret);
    }
}

module.exports = {jwtToken}