const { Sequelize } = require('sequelize');
const { DataTypes } = require('sequelize'); // Import the built-in data types
const sequelize = new Sequelize('promptmanager', 'myuser', 'mypassword', {
    host: 'db',
    port: 5432,
    dialect: 'postgres'
});

// async function testConnection() {
//     try {
//         await sequelize.authenticate();
//         console.log('Connection has been established successfully.');
//     } catch (error) {
//         console.error('Unable to connect to the database:', error);
//     }
// }
//
// testConnection();


const prompt = sequelize.define('prompt', {
    title: {type: DataTypes.STRING(60), allowNULL: false},
    description: {type: DataTypes.TEXT},
    favorite: {type: DataTypes.BOOLEAN},
})
// const prompt1 = prompt.create({title: "hi", description: "Hello world!", favorite: false});
async function renderPrompts(iterator) {
        await prompt.sync()
    if (iterator[0] === "all") {
        return await prompt.findAll()
    } else if (iterator[0] === "single"){
        return await prompt.findAll({where: {id: iterator[1]}})
    }
}
// renderPrompts()
module.exports = {renderPrompts, prompt}