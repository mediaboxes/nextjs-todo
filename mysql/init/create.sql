DROP DATABASE IF EXISTS `todo_database`;
CREATE DATABASE `todo_database`;
USE `todo_database`;

CREATE TABLE `todo_data` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `todo_list_id` int(11) unsigned NOT NULL,
  `text` varchar(32) NOT NULL DEFAULT '',
  `deadline_at` date NOT NULL,
  `complete` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `todo_list_id` (`todo_list_id`),
  KEY `complete` (`complete`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `todo_lists` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(32) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;