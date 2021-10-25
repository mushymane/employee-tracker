const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
// const util = require('util');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employees_db'
    },
    console.log(`Connected to the employees database.`)
);

function menu() {
    inquirer
        .prompt([{
            type: 'list',
            name: 'menu',
            message: "What would you like to do?",
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'I am done here'
            ]
        }])
        .then((answers) => {
            switch (answers.menu) {
                case 'View all departments':
                    viewDepartments();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    updateEmployee();
                    break;
                case 'I am done here':
                    return;
                default:
                    console.log('Oops, something wrong happened')
            }
        })
        .catch((err) => console.log(err))
}

function viewDepartments() { //async?
    console.log('viewing deoartments')
    const query = 'SELECT * FROM departments'
    // let [data, fields] = await db.query(query)
    //     // console.table(results);
    //     console.table(data);
    // console.log(db)
    db.promise().query(query)
        .then((results) => {
            // console.log(results)
            console.table(results[0])
        })
        .catch('error egtting the rows')
        .then(() => {
            menu()
        })
}

function viewRoles() {
    console.log('viewing roles')
    menu()
}

function viewEmployees() {
    console.log('viewing employees')
    menu()
}

function addDepartment() {
    console.log('adding dept')
    menu()
}

function addRole() {
    console.log('adding role')
    menu()
}

function addEmployee() {
    console.log('adding employee')
    menu()
}

function updateEmployee() {
    console.log('updating employees')
    menu()
}

function init() {
    console.log('Welcome to your company employee manager.')
    menu()
}

init();