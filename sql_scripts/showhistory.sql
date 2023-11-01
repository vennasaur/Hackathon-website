DROP PROCEDURE IF EXISTS showhistory; 

DELIMITER ** 

CREATE PROCEDURE showhistory(
IN player_n CHAR(20)
)
BEGIN

SELECT * FROM student_house_history WHERE person_name=player_n;

END** 


DELIMITER ; 