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

// change department_id to actual department name
function viewRoles() {
    console.log('viewing roles')
    const query = 'SELECT * FROM roles';
    db.promise().query(query)
        .then((results) => {
            console.table(results[0])
        })
        .catch('error getting the rows')
        .then(() => {
            menu();
        })
}

// *******need to figure out manager thing
function viewEmployees() {
    console.log('viewing employees')
    const query = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name, roles.salary 
        FROM ((employees 
            INNER JOIN roles ON employees.role_id = roles.id)
            INNER JOIN departments ON roles.department_id = departments.id)`
    db.promise().query(query)
        .then((results) => {
            console.table(results[0])
        })
        .catch(console.log('error getting the rows'))
        .then(() => {
            menu();
        })
}

function addDepartment(departmentName) {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'departmentname',
                message: "What department would you like to add?"
            }
        ])
        .then((answer) => {
            const departmentName = answer.departmentname;
            const query = `INSERT INTO departments (name) VALUES ('${departmentName}')`;
            db.promise().query(query)
                .then((results) => {
                console.log('successfully added department')
            })
            .catch(console.log('error adding new department'))
            .then(() => {
                menu();
            })
        })
        .catch((err) => console.log(err))
        
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