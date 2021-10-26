const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
// const util = require('util');

// let managers = []

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
            console.log(results[0])
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
    const query = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name, roles.salary, 
        concat(m.first_name, ' ', m.last_name) as Manager  
        FROM employees 
            INNER JOIN roles ON employees.role_id = roles.id
            INNER JOIN departments ON roles.department_id = departments.id 
            LEFT JOIN employees m ON m.id = employees.manager_id`
    db.promise().query(query)
        .then((results) => {
            console.table(results[0])
        })
        .catch('error getting the rows')
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
    let departments = []
    const query = 'SELECT name FROM departments';
    db.promise().query(query)
        .then((results) => {
            results[0].forEach((dept) => departments.push(dept.name))
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'rolename',
                        message: "What role would you like to add?"
                    },
                    {
                        type: 'number',
                        name: 'salary',
                        message: "What is the starting salary for this role?"
                    },
                    {
                        type: 'list',
                        name: 'department',
                        message: "Which department does the role belong to?",
                        choices: departments
                    }
                ])
                .then((answer) => {
                    const { rolename, salary } = answer;
                    const department_id = departments.indexOf(answer.department) + 1;
                    const query = `INSERT INTO roles (title, salary, department_id) 
                        VALUES ('${rolename}', ${salary}, ${department_id})`;
                    db.promise().query(query)
                        .then((results) => {
                        console.log('successfully added role')
                    })
                    .catch((err) => console.log(err))
                    .then(() => {
                        menu();
                    })
                })
            }
        )
        // .catch((err) => console.log(err))
        // })
        // .catch('error getting the rows')
        // .then(() => {
        //     menu();
        // })
}

function addEmployee() {
    let roles = []
    let managers = ['None']
    // getManagers()
    // console.log(managers)
    // const query = 'SELECT title FROM roles';
    // db.promise().query(query)
    //     .then((results) => {
    //         results[0].forEach((role) => roles.push(role.title));
    //     })
    const query = `select roles.title, concat(employees.first_name, ' ', employees.last_name) as Managers
        from employees right join roles on employees.role_id = roles.id 
        where employees.manager_id is null`;
    db.promise().query(query)
        .then((results) => {
            // console.log(results[0])
            results[0].forEach((role) => {
                if (role.title !== null) {
                    roles.push(role.title);
                }
                if (role.Managers !== null) {
                    managers.push(role.Managers);
                }
            })
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'firstname',
                        message: "What is the employee's first name?"
                    },
                    {
                        type: 'input',
                        name: 'lastname',
                        message: "What is the employee's last name?"
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: "What is the employee's role?",
                        choices: roles
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: "Who is the employee's manager?",
                        choices: managers
                    }
                ])
                .then((answer) => {
                    const { firstname, lastname } = answer;
                    const roleId = roles.indexOf(answer.role) + 1;
                    let managerId;
                    if (answer.manager === 'None') {
                        managerId = null;
                    } else {
                        managerId = managers.indexOf(answer.manager) + 2
                    }
                    const query = `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
                        VALUES ('${firstname}', '${lastname}', ${roleId}, ${managerId})`;
                    db.promise().query(query)
                        .then((results) => {
                        console.log('successfully added role')
                    })
                    .catch((err) => console.log(err))
                    .then(() => {
                        menu();
                    })
                })
            })
            // console.log(roles)
            // console.log(managers)
    
}

// inquirer
//     .prompt([
//         {
//             type: 'input',
//             name: 'firstname',
//             message: "What is the employee's first name?"
//         },
//         {
//             type: 'input',
//             name: 'lastname',
//             message: "What is the employee's last name?"
//         },
//         {
//             type: 'list',
//             name: 'role',
//             message: "What is the employee's role?",
//             choices: roles
//         },
//         {
//             type: 'list',
//             name: 'manager',
//             message: "Who is the employee's manager?",
//             choices: ['None',]
//         }
//     ])

function updateEmployee() {
    console.log('updating employees')
    menu()
}

function getManagers() {
    let managers = ['None']
    const query = `SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS Manager 
        FROM employees WHERE manager_id IS NULL`;
    db.promise().query(query)
    .then((results) => {
        results[0].forEach((manager) => managers.push(manager.Manager));
        console.log(managers)
        return managers;
    })
    .catch((err) => console.log(err, 'unable to retireve manager list'))
}

function init() {
    console.log('Welcome to your company employee manager.')
    menu()
}

init();