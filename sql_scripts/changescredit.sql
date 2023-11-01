DROP PROCEDURE IF EXISTS cscredit; 

DELIMITER $$ 

CREATE PROCEDURE cscredit(
IN p1 CHAR(25), 
IN p2 CHAR(25),
IN cred INT
)
BEGIN

INSERT INTO student_house_history (person_1,person_name,ccredit)
VALUES (p1,p2,cred);

END$$ 


DELIMITER ; 