DROP PROCEDURE IF EXISTS dtables; 

DELIMITER $$ 

CREATE PROCEDURE dtables(
)
BEGIN

DROP TABLE student_house_history;
DROP TABLE student_house_stat;
DROP TABLE student_rank;
DROP TABLE houses;

END$$ 


DELIMITER ; 