--TABLE CREATION
CREATE TABLE employees(
emp_no INT PRIMARY KEY,
birth_date DATE,
first_name VARCHAR(30),
last_name VARCHAR(30),
gender VARCHAR(1),
hire_date DATE
);

CREATE TABLE titles(
emp_no INT PRIMARY KEY,
title VARCHAR(30) NOT NULL,
from_date DATE,
to_date DATE,
FOREIGN KEY (emp_no) REFERENCES employees (emp_no)
);

CREATE TABLE salaries(
emp_no INT PRIMARY KEY,
salary INT NOT NULL,
from_date DATE,
to_date DATE,
FOREIGN KEY (emp_no) REFERENCES employees (emp_no)
);

CREATE TABLE departments(
dept_no VARCHAR(4) PRIMARY KEY,
dept_name VARCHAR(30) NOT NULL
);

CREATE TABLE dept_manager(
dept_no VARCHAR(4) NOT NULL,
emp_no INT PRIMARY KEY
from_date DATE,
to_date DATE,
FOREIGN KEY (emp_no) REFERENCES employees (emp_no),
FOREIGN KEY (dept_no) REFERENCES departments (dept_no)
);

CREATE TABLE dept_emp(
emp_no INT PRIMARY KEY,
dept_no VARCHAR(4) NOT NULL,
from_date DATE,
to_date DATE,
FOREIGN KEY (emp_no) REFERENCES employees (emp_no),
FOREIGN KEY (dept_no) REFERENCES departments (dept_no)
);
