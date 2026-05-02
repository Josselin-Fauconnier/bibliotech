CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at DATETIME DEFAULT NOW(),
  deleted_at DATETIME DEFAULT NULL
);

CREATE TABLE reading_lists (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE list_books (
  id INT PRIMARY KEY AUTO_INCREMENT,
  list_id INT NOT NULL,
  book_id VARCHAR(50) NOT NULL,
  added_at DATETIME DEFAULT NOW(),
  FOREIGN KEY (list_id) REFERENCES reading_lists(id) ON DELETE CASCADE
);

CREATE TABLE comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  book_id VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE user_events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_type ENUM('register', 'delete', 'login') NOT NULL,
  user_id INT DEFAULT NULL,
  created_at DATETIME DEFAULT NOW()
);
