DROP PROCEDURE IF EXISTS sumplayers; 

DELIMITER **

CREATE PROCEDURE sumplayers(
)
BEGIN

SELECT student_house_stat.person_name, SUM(ccredit) AS total FROM student_house_history JOIN student_house_stat ON student_house_history.person_name = student_house_stat.person_name 
JOIN houses ON student_house_stat.id = houses.team_id GROUP BY student_house_stat.person_name;

END**


DELIMITER ; 