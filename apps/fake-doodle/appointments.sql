-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 18, 2022 at 02:49 AM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `appointments`
--

-- --------------------------------------------------------

--
-- Table structure for table `apointmets`
--

CREATE TABLE `apointmets` (
  `id` int(11) NOT NULL,
  `creator` int(11) NOT NULL,
  `date` datetime DEFAULT current_timestamp(),
  `title` varchar(255) NOT NULL,
  `place` varchar(255) DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `expire_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `apointmets`
--

INSERT INTO `apointmets` (`id`, `creator`, `date`, `title`, `place`, `description`, `expire_date`) VALUES
(5, 3, '2022-04-16 00:11:34', '4566666666666666666666666666666666666666666', 'xzcxzcxzc', 'hjasdfghjkljhgfddgvbkj,khnilknsaoiyxjkbck.,kdsyxncb hjvsdmgj<mnc,jvkfc<bs   dsvafads', '2022-04-16'),
(6, 3, '2022-04-16 00:11:38', 'dsssssssssssssssssssssssssssssssssssssssssssssssssssssssss', 'xzcxzcxzc', '', '2022-04-16'),
(8, 3, '2022-04-13 00:28:39', 'Metting ...', 'Company resutrant ...', 'pal pala pal ', '2022-04-14');

-- --------------------------------------------------------

--
-- Table structure for table `termine`
--

CREATE TABLE `termine` (
  `id` int(11) NOT NULL,
  `id_apointmet` int(11) NOT NULL,
  `date` datetime DEFAULT current_timestamp(),
  `user` varchar(255) DEFAULT NULL,
  `checked` int(1) DEFAULT 0,
  `comment` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `termine`
--

INSERT INTO `termine` (`id`, `id_apointmet`, `date`, `user`, `checked`, `comment`) VALUES
(1, 8, '2022-04-15 01:19:10', 'test', 1, 'jkdjhd'),
(2, 8, '2022-04-15 01:19:10', 'eeee', 0, NULL),
(4, 8, '2022-04-10 01:19:33', 'test', 1, '123'),
(5, 8, '2022-04-10 01:19:33', 'mohammed Ali', 1, '123132');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`) VALUES
(3, 'google'),
(6, 'majarah'),
(5, 'microsoft'),
(1, 'udicity');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `apointmets`
--
ALTER TABLE `apointmets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `creator` (`creator`);

--
-- Indexes for table `termine`
--
ALTER TABLE `termine`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_apointmet` (`id_apointmet`),
  ADD KEY `user` (`user`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `apointmets`
--
ALTER TABLE `apointmets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `termine`
--
ALTER TABLE `termine`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `apointmets`
--
ALTER TABLE `apointmets`
  ADD CONSTRAINT `apointmets_ibfk_1` FOREIGN KEY (`creator`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `termine`
--
ALTER TABLE `termine`
  ADD CONSTRAINT `termine_ibfk_1` FOREIGN KEY (`id_apointmet`) REFERENCES `apointmets` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
