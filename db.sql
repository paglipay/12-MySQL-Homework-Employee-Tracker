DROP DATABASE IF EXISTS employeeDB;
CREATE database employeeDB;

USE employeeDB;

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NULL,
  department VARCHAR(100) NULL,
  role VARCHAR(100) NULL,
  PRIMARY KEY (id)
);

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NULL,
  PRIMARY KEY (id)
);

SELECT * FROM employee;
select * from department;
select * from role;
