DROP PROCEDURE IF EXISTS showteam; 

DELIMITER **

CREATE PROCEDURE showteam(
IN team CHAR(20)
)
BEGIN

SELECT team_id, house_name, location, person_name, rank_name, pro FROM houses JOIN student_house_stat
ON student_house_stat.id = houses.team_id JOIN student_rank ON student_house_stat.valorant_rank = student_rank.val_rank WHERE house_name = team;

END**


DELIMITER ; 