BEGIN;

TRUNCATE
  "form",
  "phrase",
  "motif",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Dunder Mifflin Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO motif ("id", "name", "notes", "user_id")
VALUES
  (1,'Idea one', '{0,1,0,0,1,0,1,0}', 1),
  (2,'lil arp', '{0,2,4,7}', 1),
  (3,'root circle', '{-2,2,-1,-1,0}', 1),
  (4,'jux', '{-2,0,3,5}', 1);

INSERT INTO phrase ("id", "name", "motifs", "modal_shifts", "user_id")
VALUES
  (1,'rondo', '{1,2,1,3,1}','{0,0,0,0,0}', 1),
  (2,'AABA', '{1,1,3,1}','{0,2,0,0}', 1),
  (3,'descender', '{4,2,4,2,2,2}','{1,-2,2,2,1,0}', 1);
  
INSERT INTO form ("id", "name", "phrases", "transpositions", "user_id")
VALUES
  (1,'rondo', '{1,2,1,3,1}','{0,0,2,1,0}', 1),
  (2,'AABA', '{1,1,3,1}','{0,2,0,0}', 1),
  (3,'descender', '{4,2,4,2,2,2}','{1,-2,2,6,1,0}', 1);

SELECT setval('form_id_seq', (SELECT MAX(id) from "form"));
SELECT setval('phrase_id_seq', (SELECT MAX(id) from "phrase"));
SELECT setval('motif_id_seq', (SELECT MAX(id) from "motif"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;
