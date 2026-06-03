-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : mer. 03 juin 2026 à 08:30
-- Version du serveur : 8.4.3
-- Version de PHP : 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `bibliotech`
--

-- --------------------------------------------------------

--
-- Structure de la table `comments`
--

CREATE TABLE `comments` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `book_id` varchar(50) NOT NULL,
  `content` text NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `comments`
--

INSERT INTO `comments` (`id`, `user_id`, `book_id`, `content`, `created_at`) VALUES
(6, 5, 'OL25147980W', 'Le citron mange des ratons', '2026-05-29 16:24:23');

-- --------------------------------------------------------

--
-- Structure de la table `list_books`
--

CREATE TABLE `list_books` (
  `id` int NOT NULL,
  `list_id` int NOT NULL,
  `book_id` varchar(50) NOT NULL,
  `added_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `list_books`
--

INSERT INTO `list_books` (`id`, `list_id`, `book_id`, `added_at`) VALUES
(4, 4, 'OL25147980W', '2026-05-29 09:30:01');

-- --------------------------------------------------------

--
-- Structure de la table `login_attempts`
--

CREATE TABLE `login_attempts` (
  `id` int NOT NULL,
  `ip` varchar(45) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `login_attempts`
--

INSERT INTO `login_attempts` (`id`, `ip`, `email`, `created_at`) VALUES
(1, '::1', 'Biblio@test.com', '2026-05-13 16:39:55'),
(2, '::1', 'Biblio@test.com', '2026-05-13 16:40:24'),
(3, '::1', 'Biblio@test.com', '2026-05-13 16:40:26'),
(4, '::1', 'Biblio@test.com', '2026-05-13 16:40:27'),
(5, '::1', 'Biblio@test.com', '2026-05-13 16:40:28'),
(6, '::1', 'test@test.fr', '2026-05-18 11:36:37'),
(7, '::1', 'test@test.fr', '2026-05-18 11:48:05'),
(8, '::1', 'test@test.fr', '2026-05-18 11:48:07'),
(9, '::1', 'test@test.fr', '2026-05-18 11:48:08'),
(10, '::1', 'test@test.fr', '2026-05-18 11:48:09'),
(11, '::1', 'test@test.fr', '2026-05-20 10:47:36'),
(12, '::1', 'test@test.fr', '2026-05-22 15:45:50'),
(13, '::1', 'fauconnonierjosselin@yahoo.fr', '2026-05-25 16:07:41'),
(14, '::1', 'Harepin@test.fr', '2026-05-27 16:24:29'),
(15, '::1', 'Harepin@test.fr', '2026-05-29 10:12:57'),
(16, '::1', 'Harepin@test.fr', '2026-06-01 14:46:26');

-- --------------------------------------------------------

--
-- Structure de la table `reading_lists`
--

CREATE TABLE `reading_lists` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `reading_lists`
--

INSERT INTO `reading_lists` (`id`, `user_id`, `name`, `description`, `created_at`) VALUES
(3, 3, 'frieren', NULL, '2026-05-22 16:26:57'),
(4, 5, 'frieren', NULL, '2026-05-25 16:10:14');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  `banned_at` datetime DEFAULT NULL,
  `banned_until` datetime DEFAULT NULL,
  `ban_reason` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`, `deleted_at`, `banned_at`, `banned_until`, `ban_reason`) VALUES
(1, 'Livre', 'Biblio@test.com', '$2b$12$NMJVdNP1upKklnAArdq5vu7Ma9X9LPxklujYg/Xm0V0DcQ9H233ba', 'user', '2026-05-13 16:36:20', NULL, NULL, NULL, NULL),
(2, 'Josselin', 'fauconnonierjosselin@yahoo.fr', '$2b$12$L2QmiTs4nTHBBnoddQnqvuuOpk.T1nq7paxky7EG9IgKSqnuNGIYy', 'user', '2026-05-15 15:34:34', NULL, NULL, NULL, NULL),
(3, 'test', 'test@test.fr', '$2b$12$2Tez/Egx7oOSSKWfdLut0eJyr87I6TbcEl/8CxDMLmyCgbcY4SOui', 'admin', '2026-05-18 10:55:49', '2026-06-01 16:36:04', NULL, NULL, NULL),
(5, 'Harepin', 'Harepin@test.fr', '$2b$12$PkOcZ76GnW6AvGNXFdy9yulJaRzKgvTkSZKeFywAUrGEshS/O0kLK', 'user', '2026-05-25 16:08:43', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `user_events`
--

CREATE TABLE `user_events` (
  `id` int NOT NULL,
  `event_type` enum('register','delete','login') NOT NULL,
  `user_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `user_events`
--

INSERT INTO `user_events` (`id`, `event_type`, `user_id`, `created_at`) VALUES
(1, 'register', 1, '2026-05-13 16:36:20'),
(2, 'login', 1, '2026-05-13 16:39:36'),
(3, 'register', 2, '2026-05-15 15:34:34'),
(4, 'login', 2, '2026-05-15 15:34:52'),
(5, 'register', 3, '2026-05-18 10:55:49'),
(6, 'login', 3, '2026-05-18 11:34:06'),
(7, 'login', 3, '2026-05-20 10:43:13'),
(8, 'login', 3, '2026-05-22 09:55:02'),
(9, 'login', 3, '2026-05-22 10:19:28'),
(10, 'login', 3, '2026-05-22 14:34:37'),
(11, 'login', 3, '2026-05-22 15:46:08'),
(12, 'login', 3, '2026-05-22 16:26:37'),
(13, 'register', 5, '2026-05-25 16:08:43'),
(14, 'login', 5, '2026-05-25 16:08:54'),
(15, 'login', 5, '2026-05-27 14:19:49'),
(16, 'login', 5, '2026-05-27 14:20:59'),
(17, 'login', 5, '2026-05-27 16:24:58'),
(18, 'login', 5, '2026-05-27 16:48:56'),
(19, 'login', 5, '2026-05-29 09:24:43'),
(20, 'login', 5, '2026-05-29 10:13:10'),
(21, 'login', 3, '2026-05-29 14:11:47'),
(22, 'login', 3, '2026-05-29 14:19:18'),
(23, 'login', 5, '2026-05-29 15:53:10'),
(24, 'login', 3, '2026-05-29 16:18:56'),
(25, 'login', 5, '2026-05-29 16:20:29'),
(26, 'login', 3, '2026-05-29 16:24:53'),
(27, 'login', 3, '2026-05-29 16:46:47'),
(28, 'login', 5, '2026-06-01 13:50:35'),
(29, 'login', 5, '2026-06-01 14:49:08'),
(30, 'login', 3, '2026-06-01 16:25:26'),
(31, 'login', 5, '2026-06-01 16:49:02');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `list_books`
--
ALTER TABLE `list_books`
  ADD PRIMARY KEY (`id`),
  ADD KEY `list_id` (`list_id`);

--
-- Index pour la table `login_attempts`
--
ALTER TABLE `login_attempts`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `reading_lists`
--
ALTER TABLE `reading_lists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `user_events`
--
ALTER TABLE `user_events`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `list_books`
--
ALTER TABLE `list_books`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `login_attempts`
--
ALTER TABLE `login_attempts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pour la table `reading_lists`
--
ALTER TABLE `reading_lists`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `user_events`
--
ALTER TABLE `user_events`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `list_books`
--
ALTER TABLE `list_books`
  ADD CONSTRAINT `list_books_ibfk_1` FOREIGN KEY (`list_id`) REFERENCES `reading_lists` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `reading_lists`
--
ALTER TABLE `reading_lists`
  ADD CONSTRAINT `reading_lists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
