        DROP TABLE IF EXISTS houses;
        
        CREATE TABLE houses (team_id INT, house_name VARCHAR(64), location VARCHAR(2), PRIMARY KEY(team_id));
        
        INSERT INTO houses (team_id, house_name, location) VALUES
            (100, 'B Team', 'NA'),
            (101, '100 Thieves', 'NA'),
            (102, 'Envy Gaming', 'EU'),
            (103, 'Sentinels', 'NA'),
            (104, 'Plinsters', 'NA'),
            (105, 'NA Free Agent', 'NA'),
            (106, 'EU Free Agent', 'EU');
            
        
        DROP TABLE IF EXISTS student_rank;
        CREATE TABLE student_rank (val_rank INT, rank_name VARCHAR(25), pro VARCHAR(5), PRIMARY KEY(val_rank));
        
        INSERT INTO student_rank (val_rank, rank_name, pro) VALUES
            (200, 'Radiant','true'),
            (201, 'Immortal','true'),
            (202, 'Diamond','true'),
            (203, 'Platinum','false'),
            (204, 'Gold','false'),
            (205, 'Plastic','false');
        
        
        DROP TABLE IF EXISTS student_house_stat;
        CREATE TABLE student_house_stat (id INT, person_name VARCHAR(25), valorant_rank INT, PRIMARY KEY(person_name), FOREIGN KEY (id) REFERENCES houses(team_id), FOREIGN KEY (valorant_rank) REFERENCES student_rank(val_rank));
        
        INSERT INTO student_house_stat (id, person_name,valorant_rank) VALUES 
            (100, 'walmarht', 204),
            (100, 'tedday', 205),
            (100, 'Sofa', 204),
            (100, 'chelL', 205),
            (100, '.erthy8', 202),
            (101, '100T Hiko', 200),
            (101,'100T Ethan', 200),
            (101, '100T steel', 200),
            (101,'100T nitr0', 200),
            (101,'100T asuna', 200),
            (102, 'NV yay', 200),
            (102, 'NV Marved', 200),
            (102, 'NV Victor', 200),
            (102, 'NV crashies', 200),
            (102, 'NV FNS', 200),
            (103, 'SEN TenZ', 200),
            (103, 'SEN SicK', 200),
            (103, 'SEN Shazam', 200),
            (103, 'SEN dapr', 200),
            (103, 'SEN zombs', 200),
            (104, 'JoeAYAYA', 203),
            (104, 'Gnaij', 203),
            (104, 'MT hushmore', 202),
            (104, 'BHYUN', 203),
            (104, 'Croaset', 201)
            ;
        
        
        DROP TABLE IF EXISTS student_house_history;
        CREATE TABLE student_house_history (person_1 VARCHAR(25), person_name VARCHAR(25), ccredit INT, FOREIGN KEY (person_name) REFERENCES student_house_stat(person_name));
        
        INSERT INTO student_house_history (person_1,person_name,ccredit) VALUES
            ('Admin', 'walmarht', 0),
            ('Admin', 'tedday', 0),
            ('Admin', 'Sofa', 0),
            ('Admin', '.erthy8', 0),
            ('Admin', '100T Hiko', 0),
            ('Admin', '100T Ethan', 0),
            ('Admin', '100T steel', 0),
            ('Admin', '100T nitr0', 0),
            ('Admin', '100T asuna', 0),
            ('Admin', 'NV yay', 0),
            ('Admin', 'NV Marved', 0),
            ('Admin', 'NV Victor', 0),
            ('Admin', 'NV crashies', 0),
            ('Admin', 'NV FNS', 0),
            ('Admin', 'SEN TenZ', 0),
            ('Admin', 'SEN SicK', 0),
            ('Admin', 'SEN Shazam', 0),
            ('Admin', 'SEN dapr', 0),
            ('Admin', 'SEN zombs', 0),
            ('Admin', 'JoeAYAYA', 0),
            ('Admin', 'Gnaij', 0),
            ('Admin', 'MT hushmore', 0),
            ('Admin', 'BHYUN', 0),
            ('Admin', 'Croaset', 0),
            ('Admin', 'chelL', -800000);
            

-- SELECT team_id, house_name, location, person_name, valorant_rank, rank_name, pro FROM houses JOIN student_house_stat ON 
-- student_house_stat.id = houses.team_id JOIN student_rank ON student_house_stat.valorant_rank = student_rank.val_rank;