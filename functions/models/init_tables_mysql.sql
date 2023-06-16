CREATE TABLE people_table (
    user_id INT NOT NULL UNIQUE AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(45) NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    jwt_token VARCHAR(255),
    bio VARCHAR(100)
);
CREATE TABLE projects_table (
    project_id INT NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
    owner_id INT NOT NULL,
    project_name VARCHAR(45) NOT NULL,
    FOREIGN KEY (owner_id)
        REFERENCES people_table (user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE people_projects_avail_table (
    avail_id INT NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
    user_id INT NOT NULL,
    project_id INT NOT NULL,
    permission VARCHAR(45) NOT NULL,
    start_avail_datetime DATETIME NOT NULL,
    end_avail_datetime DATETIME NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES people_table (user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (project_id)
        REFERENCES projects_table (project_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE task_groups_table (
    group_id INT NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
    project_id INT NOT NULL,
    task_name VARCHAR(45) NOT NULL,
    pax INT NOT NULL,
    FOREIGN KEY (project_id)
        REFERENCES projects_table (project_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE tasks_table (
    task_id INT NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
    user_id INT,
    group_id INT NOT NULL,
    start_task_datetime DATETIME NOT NULL,
    end_task_datetime DATETIME NOT NULL,
    completed BOOLEAN NOT NULL,
    preassigned BOOLEAN NOT NULL,
    priority INT NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES people_table (user_id)
        ON UPDATE CASCADE,
    FOREIGN KEY (group_id)
        REFERENCES task_groups_table (group_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);



