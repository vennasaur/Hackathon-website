DROP PROCEDURE IF EXISTS showhtable; 

DELIMITER ** 

CREATE PROCEDURE showhtable(
)
BEGIN

SELECT team_id, house_name, location, person_name, valorant_rank, rank_name, pro FROM houses JOIN student_house_stat ON student_house_stat.id = houses.team_id JOIN student_rank ON student_house_stat.valorant_rank = student_rank.val_rank;

END** 


DELIMITER ; 