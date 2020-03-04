--Question 1
SELECT e.emp_no, e.last_name, e.first_name, e.gender, s.salary
FROM employees AS e
JOIN salaries AS s ON
e.emp_no=s.emp_no;
--Question 2
SELECT * 
FROM employees
WHERE EXTRACT (YEAR FROM hire_date) = 1986;
--Question 3
SELECT dm.dept_no, 
	(SELECT d.dept_name
	FROM departments as d
	WHERE d.dept_no=dm.dept_no),
	dm.emp_no,
		  (SELECT e.last_name
		  FROM employees as e
		  WHERE dm.emp_no=e.emp_no),
		  (SELECT e.first_name
		  FROM employees as e
		  WHERE dm.emp_no=e.emp_no),
	dm.from_date,
	dm.to_date		  
FROM dept_manager AS dm;
--Question 4
SELECT de.emp_no, e.last_name, e.first_name, d.dept_name
FROM dept_emp AS de
JOIN employees AS e ON
e.emp_no=de.emp_no
JOIN departments AS d ON
de.dept_no=d.dept_no
;
--Question 5
SELECT * 
FROM employees
WHERE (first_name = 'Hercules') AND (last_name LIKE 'B%');
--Question 6
SELECT de.emp_no, e.last_name, e.first_name, d.dept_name
FROM dept_emp AS de
JOIN employees AS e ON
e.emp_no=de.emp_no
JOIN departments AS d ON
de.dept_no=d.dept_no
WHERE d.dept_name = 'Sales';
--Question 7
SELECT de.emp_no, e.last_name, e.first_name, d.dept_name
FROM dept_emp AS de
JOIN employees AS e ON
e.emp_no=de.emp_no
JOIN departments AS d ON
de.dept_no=d.dept_no
WHERE d.dept_name = 'Sales' OR d.dept_name = 'Development';
--Question 8
SELECT last_name, count(last_name) AS "Frequency"
FROM employees
GROUP BY last_name
ORDER BY "Frequency" DESC;