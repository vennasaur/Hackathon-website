
DROP TABLE IF EXISTS votes;

CREATE TABLE votes(id VARCHAR(100), nvotes INT, PRIMARY KEY(id));

INSERT INTO votes(id, nvotes) VALUES ('a', 0);
INSERT INTO votes(id, nvotes) VALUES ('b', 0);
INSERT INTO votes(id, nvotes) VALUES ('c', 0);
INSERT INTO votes(id, nvotes) VALUES ('d', 0);
INSERT INTO votes(id, nvotes) VALUES ('e', 0);