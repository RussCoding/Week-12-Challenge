INSERT INTO departments
  (name)
VALUES
  ('Custodial'),
  ('Sales'),
  ('Engineering'),
  ('Legal');

-- Inserts roles of employee into role table
INSERT INTO roles
  (title, salary, department_id)
VALUES
  ('Software Engineer', 85000, 3),
  ('Salesperson', 75000, 2),
  ('Janitor', 125000, 1),
  ('Lawyer', 200000, 4);

-- Inserts employee information into employee table
INSERT INTO employees
  (first_name, last_name, role_id, manager_id)
VALUES
  ('John', 'Plaza', 1, 3),
  ('Amy', 'Villa', 2, 1),
  ('Jesus', 'Gutierrez', 3, 2),
  ('Sam', 'Anne', 4, 1);