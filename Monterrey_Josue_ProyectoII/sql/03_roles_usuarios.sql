USE flujex

DROP ROLE IF EXISTS 'admin';
DROP ROLE IF EXISTS 'app';

CREATE ROLE 'admin';
CREATE ROLE 'app';

GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP ON * TO 'admin';
GRANT SELECT, INSERT, UPDATE ON * TO 'app';

DROP USER IF EXISTS 'flujex_admin'@'localhost';
CREATE USER 'flujex_admin'@'localhost' IDENTIFIED BY 'ADMIN_PWD';
GRANT 'admin' TO 'flujex_admin'@'localhost';
ALTER USER 'flujex_admin'@'localhost' DEFAULT ROLE 'admin';

DROP USER IF EXISTS 'flujex_app'@'localhost';
CREATE USER 'flujex_app'@'localhost' IDENTIFIED BY 'APP_PWD';
GRANT 'app' TO 'flujex_app'@'localhost';
ALTER USER 'flujex_app'@'localhost' DEFAULT ROLE 'app';

FLUSH PRIVILEGES;