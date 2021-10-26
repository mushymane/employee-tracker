INSERT INTO departments (name) VALUES 
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO roles (title, salary, department_id) VALUES 
    ('Sales Lead', 100000, 1),
    ('Salesperson', 80000, 1),
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 120000, 2),
    ('Account Manager', 160000, 3),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Lawyer', 190000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES 
    ('Jon', 'Snow', 3, null),
    ('Arya', 'Stark', 4, 1),
    ('Robb', 'Stark', 4, 1),
    ('Tyrion', 'Lannister', 5, null), 
    ('Jaime', 'Lannister', 6, 4),
    ('Cersei', 'Lannister', 1, null),
    ('Petyr', 'Baelish', 2, 6), 
    ('Daenerys', 'Targaryen', 7, null), 
    ('Jorah', 'Mormont', 8, 8), 
    ('Daario', 'Naharis', 8, 8); 