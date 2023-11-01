DROP PROCEDURE IF EXISTS addpoints; 

DELIMITER **

CREATE PROCEDURE addpoints(
IN person CHAR(20),
IN player_name CHAR(20),
IN ccredit INT
)
BEGIN

INSERT INTO student_house_history (person_1,person_name,ccredit) VALUES
            (person, player_name, ccredit);

END**


DELIMITER ; 