const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

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

// Main menu
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
                    return console.log('Oops, something wrong happened')
            }
        })
        .catch((err) => console.log(err))
}

// View departments - department id and department name
function viewDepartments() { //async?
    console.log('~~~~~~~~~~ Company Departments ~~~~~~~~~~')
    const query = 'SELECT * FROM departments'
    // let [data, fields] = await db.query(query)
    //     // console.table(results);
    //     console.table(data);
    // console.log(db)
    db.promise().query(query)
        .then((results) => {
            console.table(results[0])
        })
        .catch('error egtting the rows')
        .then(() => {
            menu()
        })
}

// View roles - role id, title, salary, department
function viewRoles() {
    console.log('~~~~~~~~~~ Company Roles ~~~~~~~~~~')
    const query = `SELECT roles.id, roles.title, roles.salary, departments.name as department 
        FROM roles right join departments on roles.department_id = departments.id`;
    db.promise().query(query)
        .then((results) => {
            console.table(results[0])
        })
        .catch('error getting the rows')
        .then(() => {
            menu();
        })
}

// View all employees - employee id, name, title, 
function viewEmployees() {
    console.log('~~~~~~~~~~ All Employees ~~~~~~~~~~')
    const query = `SELECT employees.id, employees.first_name as 'first name', employees.last_name as 'last name', 
        roles.title, departments.name as department, roles.salary, 
        concat(m.first_name, ' ', m.last_name) as manager 
        FROM employees 
        INNER JOIN roles ON employees.role_id = roles.id
        INNER JOIN departments ON roles.department_id = departments.id 
        LEFT JOIN employees m ON m.id = employees.manager_id`;

    db.promise().query(query)
        .then((results) => {
            console.table(results[0])
        })
        .catch('error getting the rows')
        .then(() => {
            menu();
        })
}

// Add a new department
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

// Add a new role
function addRole() {
    // Store each department name in array
    let departments = []

    // Query the database
    const query = 'SELECT name FROM departments';
    db.promise().query(query)
        .then((results) => {
            results[0].forEach((dept) => departments.push(dept.name)) // Populate the departments array
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
                    const { rolename, salary } = answer; // Grab the inputs
                    // The departments id column is similar to the departments column, offset by 1
                    const department_id = departments.indexOf(answer.department) + 1;
                    // Query the database
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
}

// Add another employee
function addEmployee() {
    let roles = [] // Stores titles
    let roleIds = [] // Stores objects { title, role_id }
    let managers = [] // Stores managers
    let managerIds = [] // Stores objects { name, employee_id }

    // Database Query
    const query = `select employees.id as mid, concat(employees.first_name, ' ', employees.last_name) as Managers, 
        roles.title, roles.id as rid, employees.manager_id 
        from employees right join roles on employees.role_id = roles.id 
        where employees.manager_id is null or roles.title is not null`;

    db.promise().query(query)
        .then((results) => {
            // console.log(results[0])

            // We need to populate the arrays above
            results[0].forEach((role) => {
                if (role.title !== null ) {
                    // Instantiate a new object with a title and its corresponsing role id
                    let roleObj = {}
                    roleObj.title = role.title
                    roleObj.id = role.rid

                    // Push it to the array
                    roleIds.push(roleObj)

                    // If the roles array does not include the current object's title, include it
                    if(!roles.includes(role.title)) {
                        roles.push(role.title);
                    }
                }
                if (role.Managers !== null && role.manager_id === null) { // Make sure we are only handling managers
                    // Instantiate a new object with the manager's name and his/her corresponding employee id
                    let manObj = {}
                    manObj.name = role.Managers
                    manObj.id = role.mid

                    // Push to both arrays
                    managerIds.push(manObj);
                    managers.push(role.Managers)
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
                        choices: ['None', ...managers]
                    }
                ])
                .then((answer) => {
                    // Get the first and last name
                    const { firstname, lastname } = answer;

                    // Get the elements in roleId and managerIds arrays based on input
                    let empRole = roleIds.find(r => r.title === answer.role);
                    let empMan = managerIds.find(m => m.name === answer.manager);

                    // Assign the corresponding values
                    let roleId = empRole.id
                    let managerId;

                    if (answer.manager === 'None') {
                        managerId = null;
                    } else {
                        managerId = empMan.id;
                    }

                    // Query the database to insert a new row in employees table
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
}

// Update an employee's role
function updateEmployee() {
    let employees = [] // Store employee names
    let employeeIds = [] // Store objects { name, id }
    let roles = [] // Store titles
    let roleIds = [] // Store objects { title, role id }

    // Query
    const query = `SELECT employees.id as eid, 
    CONCAT(first_name, ' ', last_name) as name, roles.title as role, roles.id as rid 
    FROM employees RIGHT JOIN roles ON employees.role_id = roles.id`;

    db.promise().query(query)
        .then((results) => {

            // Populate the arrays above
            results[0].forEach((employee) => {
                if (employee.eid !== null ) {

                    // Instantiate a new object with the employee's name and their corresponding id, then push to employeeIds array
                    let empObj = {}
                    empObj.name = employee.name
                    empObj.id = employee.eid
                    employeeIds.push(empObj)

                    // If the employees array does not include the current employee, add their name
                    // NOTE: could be better with name/id instead of just name
                    if(!employees.includes(employee.eid)) {
                        employees.push(employee.name);
                    }
                }
                if (employee.rid !== null) {

                    // Instantiate a new object with the employee's role and its corresponding role id, then push to roleIds array
                    let roleObj = {}
                    roleObj.title = employee.role
                    roleObj.id = employee.rid
                    roleIds.push(roleObj);

                    // Avoid duplicate roles
                    if (!roles.includes(employee.role)) {
                        roles.push(employee.role)
                    }
                }
            })
            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'name',
                        message: "Which employee's role would you like to update?",
                        choices: employees
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: "Which role would you like to assign the new employee?",
                        choices: roles
                    }
                ])
                .then((answer) => {
                    const { name, role } = answer;
                    let empObj = employeeIds.find(e => e.name === name);
                    let roleObj = roleIds.find(r => r.title === role);

                    // Find the employee's id, update their role
                    const query = `UPDATE employees SET role_id = ${roleObj.id} 
                    WHERE id = ${empObj.id}`;
                    db.promise().query(query)
                        .then((results) => {
                        console.log(`successfully updated role for ${empObj.name}`)
                    })
                    .catch((err) => console.log(err))
                    .then(() => {
                        menu();
                    })
                })
            }
        )
}

// Function to start app
function init() {
    console.log('Welcome to your company employee manager.')
    menu()
}

// Start
init();