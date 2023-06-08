CREATE TABLE people_table (
    user_id INT NOT NULL UNIQUE PRIMARY KEY,
    user_name VARCHAR(45) NOT NULL,
    passwordhash VARCHAR(100) NOT NULL,
    bio VARCHAR(100)
);

CREATE TABLE projects_table (
    project_id INT NOT NULL UNIQUE PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    project_name VARCHAR(45) NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES people_table (user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE people_projects_table (
    user_id INT NOT NULL UNIQUE,
    project_id INT NOT NULL UNIQUE,
    project_name VARCHAR(45) NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES people_table (user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (project_id)
        REFERENCES projects_table (project_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE tasks_table (
	task_id INT NOT NULL UNIQUE PRIMARY KEY, 
	user_id INT NOT NULL UNIQUE, 
	project_id INT NOT NULL UNIQUE, 
    task_name VARCHAR(45) NOT NULL, 
    pax INT NOT NULL, 
    start_task_datetime DATETIME NOT NULL,
    end_task_datetime DATETIME NOT NULL,
    completed BOOLEAN NOT NULL,
    priority INT NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES people_table (user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (project_id)
        REFERENCES projects_table (project_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE avails_table (
	avail_id INT NOT NULL UNIQUE PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    project_id INT NOT NULL UNIQUE,
    start_avail_datetime DATETIME NOT NULL,
    end_avail_datetime DATETIME NOT NULL,
	FOREIGN KEY (user_id)
        REFERENCES people_table (user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (project_id)
        REFERENCES projects_table (project_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
    