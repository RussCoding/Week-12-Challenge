const inquirer = require('inquirer');
const db = require('./db/connection');
db.connect  (err => {
    if (err) throw err;
    runApp();
});

var runApp = function() {
    inquirer.prompt
    ([{
        type: 'list',
        name: 'prompt',
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
        ]
    }]).then((answers) => {
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
                db.query(`INSERT INTO departments (name) VALUES (?)`, [answers.department], (err, result) => {
                    if(err) throw err;
                    console.log('Successfully added the department!');
                    runApp();
                });
            })
        }
        else if(answers.prompt === 'Add a Role') {
            //Department list is needed so query for whole list
            db.query(`SELECT * FROM departments`, (err, result) => {
                if(err) throw err; //result will be the array of departments
                //need name of role, salary, and department id
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'role',
                        message: 'What is the role?',
                        validate: input => {
                            if (input) {
                                return true;
                            } else {
                                console.log('Please enter a name for the role!');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'What is the salary of the role?',
                        validate: input => {
                            if (input) {
                                return true;
                            } else {
                                console.log('Please Enter a proper salary!');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'input',
                        name: 'department',
                        message: 'Which department does it belong to?',
                        cvalidate: input => {
                            if (input) {
                                return true;
                            } else {
                                console.log('Please Enter a department id');
                                return false;
                            }
                        }
                    }

                ]).then((answers) => {
                    db.query (`INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`, [answers.role, answers.salary, answers.department], (err, result) => {
                        if(err) throw err;
                        console.log('Successfully added a new role');
                        runApp();
                    });
                })
            });
        }
        // Add an employee
        else if (answers.prompt === 'Add an Employee') {
            db.query(`SELECT * FROM roles`, (err, result) => {
                if(err) throw err;
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: 'What is the employees first name?',
                        validate: input => {
                            if (input) {
                                return true;
                            } else {
                                console.log('Please Add A First Name!');
                                return false;
                            }
                        }
                    },
                    {
                        // Adding Employee Last Name
                        type: 'input',
                        name: 'lastName',
                        message: 'Enter the last name',
                        validate: input => {
                            if (input) {
                                return true;
                            } else {
                                console.log('Enter the last name');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is the employees position?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].title);
                            }
                            return array;
                        }
                    },
                    {
                        type: 'input',
                        name: 'manager',
                        message: 'What is the id number of the employees manager',
                    }
                ]).then((answers) => {
                    var role_id;
                    for (var i = 0; i<result.length; i++) {
                        if(answers.role === result[i].title){
                            role_id = i;
                        }
                    }
                    db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, [answers.firstName, answers.lastName, role_id, answers.manager], (err, result) => {
                        if (err) throw err;
                        console.log('Successfully added new employee');
                        runApp();
                    });
                })
            });
        }
        else if (answers.prompt === 'Change Employee Role') {
            db.query(`SELECT * FROM roles`, (err, result) => {
                if(err) throw err; 
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'employee',
                        message: 'Enter the id number of the employee you would like to promote',
                        validate: input => {
                            if (input) {
                                return true;
                            } else {
                                console.log('Enter an id for the employee');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is the the employees new role?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].title);
                            }
                            return array;
                        }
                    }

                ]).then((answers) => {
                    var role_id;
                    for(var i = 0; i< result.length; i++){
                        if (result[i].title === answers.role)
                        {
                            role_id = i+1;
                        }
                    }
                    db.query(`UPDATE employees SET ? WHERE ?`, [{role_id: role_id}, {id: answers.employee}], (err, result) => {
                        if (err) throw err;
                        console.log('Updated employees role');
                        runApp();
                    });

                })
            });
        }
        else if (answers.prompt === 'Exit') {
            db.end();
            console.log("Thank you for using employee tracker");
        }
    })
};