const db = require('./db/connection');
const inquirer = require('inquirer');

db.connect  (err => {
    if (err) throw err;
    runApp();
});

var runApp = function() {
    inquirer.prompt
    ({
        type: 'list',
        name: 'menu',
        message: 'Main Menu',
        choices: [
            'View all Departments', 
            'View all Roles', 
            'View all Employees', 
            'Add a Department', 
            'Add a Role', 
            'Add an Employee', 
            'Change Employee Role', 
            'Exit'
        ]}).then((answers) => {
        //view all departments
        if (answers.prompt === 'View all Departments') {
            db.query('SELECT * FROM departments', (err, result) => {
                if (err) throw err;
                console.log('Departments:');
                console.table(result);
                runApp();
            });
        }
        //view all roles
        else if (answers.prompt === 'View all Roles') {
            db.query('SELECT * FROM roles', (err, result) => {
                if (err) throw err;
                console.log('Roles:');
                console.table(result);
                runApp();
            });
        }
        //view all employees
        else if (answers.prompt === 'View all Employees') {
            db.query('SELECT * FROM employees', (err, result) => {
                if (err) throw err;
                console.log('Employees:');
                console.table(result);
                runApp();
            });
        }
        //add a department
        else if (answers.prompt === 'Add a Department') {
            inquirer.prompt({
                type: 'input',
                name: 'department',
                message: 'What is the new departments name?',
                validate: input => {
                    if(input) {
                        return true;
                    } 
                    else {
                        console.log('Please enter a name');
                        return false;
                    }
                }
            }).then((answers) => {
                db.query(`INSERT INTO department (name) VALUES (?)`, [answers.department], (err, result) => {
                    if(err) throw err;
                    console.log('Successfully added the department!');
                    runApp();
                })
            })
        }
    })
};