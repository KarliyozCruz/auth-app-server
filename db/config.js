const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect( process.env.DB_CNN );

        console.log('DB online');

    }catch (error){
        throw new Error('Error a la hora de inicializar DB');
    }
}

module.exports = {
    dbConnection
}