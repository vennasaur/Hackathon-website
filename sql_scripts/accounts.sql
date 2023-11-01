
DROP TABLE IF EXISTS accounts;

CREATE TABLE accounts(id VARCHAR(100), full_name VARCHAR(200), nick VARCHAR(50), picture VARCHAR(75), PRIMARY KEY(id));

--INSERT INTO accounts(id,full_name,nick,picture) VALUES ('id','full_name','nick', 'pic');