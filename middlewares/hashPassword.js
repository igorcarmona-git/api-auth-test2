const bcrypt = require('bcrypt');

const hashPassword = (req, res, next) => {
    const { password } = req.body;
    const salt = bcrypt.genSaltSync(10); 
    const hashedPassword = bcrypt.hashSync(password, salt);
    req.body.password = hashedPassword;
    next();
};

module.exports = {
    hashPassword
}

////um "salt" é uma sequência de bits aleatória que é usada como entrada adicional para uma função de hash. Isso é feito para garantir que, mesmo que duas senhas sejam idênticas, os hashes resultantes sejam diferentes.