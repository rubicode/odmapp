const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/datadb');
}

const User = require('../models/User')
const Todo = require('../models/Todo')

function generateRandomString(length = 5) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters[randomIndex];
    }
    return randomString;
}

async function insertTodo() {
    try {
        const executor = '66631a3739ec746cca333832'
        const data = []
        for (let index = 0; index < 100; index++) {
            data.push({ title: generateRandomString(), executor })
        }
        const todos = await Todo.insertMany(data);
        process.exit(0)
    } catch (error) {
        console.log(error)
    }
}


insertTodo()



