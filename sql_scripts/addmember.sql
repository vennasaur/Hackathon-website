DROP PROCEDURE IF EXISTS addplayer; 

DELIMITER **

CREATE PROCEDURE addplayer(
IN team INT,
IN player_name CHAR(20),
IN val_rank INT
)
BEGIN
INSERT INTO student_house_stat (id, person_name,valorant_rank) VALUES 
    (team,player_name,val_rank);

INSERT INTO student_house_history (person_1,person_name,ccredit) VALUES
            ('Admin', player_name, 0);
            





END**


DELIMITER ; 