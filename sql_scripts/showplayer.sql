DROP PROCEDURE IF EXISTS showplayer; 

DELIMITER **

CREATE PROCEDURE showplayer(
IN player_n CHAR(20)

)
BEGIN

SELECT team_id, house_name, location, person_name, rank_name, pro FROM houses JOIN student_house_stat
ON student_house_stat.id = houses.team_id JOIN student_rank ON student_house_stat.valorant_rank = student_rank.val_rank WHERE person_name=player_n;

END**


DELIMITER ; 