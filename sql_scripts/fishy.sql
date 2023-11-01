
DROP TABLE IF EXISTS fishy;

CREATE TABLE fishy(id VARCHAR(100), fvotes INT, PRIMARY KEY(id));

INSERT INTO fishy(id, fvotes) VALUES ('a', 5000);
--INSERT INTO votes(id, fvotes) VALUES ('b', 0);