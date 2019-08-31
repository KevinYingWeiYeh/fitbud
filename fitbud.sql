-- MySQL dump 10.13  Distrib 5.7.19, for osx10.12 (x86_64)
--
-- Host: localhost    Database: fitbud
-- ------------------------------------------------------
-- Server version	5.7.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `friends`
--

DROP DATABASE IF EXISTS fitbud;

CREATE DATABASE fitbud;

USE fitbud;

DROP TABLE IF EXISTS `friends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `friends` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `originator` int(11) NOT NULL,
  `receiver` int(11) NOT NULL,
  `status` enum('pending','accept','reject') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `originator` (`originator`),
  KEY `receiver` (`receiver`),
  CONSTRAINT `friends_ibfk_1` FOREIGN KEY (`originator`) REFERENCES `users` (`id`),
  CONSTRAINT `friends_ibfk_2` FOREIGN KEY (`receiver`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friends`
--

LOCK TABLES `friends` WRITE;
/*!40000 ALTER TABLE `friends` DISABLE KEYS */;
INSERT INTO `friends` VALUES (1,1,2,'accept'),(2,3,1,'accept'),(3,4,1,'accept'),(4,6,7,'accept'),(5,6,8,'accept'),(6,6,9,'accept');
/*!40000 ALTER TABLE `friends` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `postings`
--

DROP TABLE IF EXISTS `postings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `postings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) DEFAULT NULL,
  `location` varchar(255) NOT NULL,
  `date` datetime DEFAULT NULL,
  `duration` int(11) NOT NULL,
  `details` varchar(255) NOT NULL,
  `meetup_spot` varchar(255) NOT NULL,
  `buddies` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `private` tinyint(1) DEFAULT NULL,
  `currentEvent` int(11) DEFAULT NULL,
  `currentLevel` enum('Beginner','Intermediate','Advanced') DEFAULT NULL,
  `photo` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `postings_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `postings`
--

LOCK TABLES `postings` WRITE;
/*!40000 ALTER TABLE `postings` DISABLE KEYS */;
/*!40000 ALTER TABLE `postings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile`
--

DROP TABLE IF EXISTS `profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profile` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gender` varchar(20) DEFAULT NULL,
  `activity` varchar(255) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `profile_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile`
--

LOCK TABLES `profile` WRITE;
/*!40000 ALTER TABLE `profile` DISABLE KEYS */;
/*!40000 ALTER TABLE `profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `requests`
--

DROP TABLE IF EXISTS `requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `postingId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `status` enum('pending','accept','reject','invite','inviteAccepted') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `postingId` (`postingId`),
  KEY `userId` (`userId`),
  CONSTRAINT `requests_ibfk_1` FOREIGN KEY (`postingId`) REFERENCES `postings` (`id`),
  CONSTRAINT `requests_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `requests`
--

LOCK TABLES `requests` WRITE;
/*!40000 ALTER TABLE `requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('AKGwrW5XD01TerMnI5ltyffyLVvbMnPh',1508099690,'{\"cookie\":{\"originalMaxAge\":3600000,\"expires\":\"2017-10-15T20:34:29.973Z\",\"httpOnly\":true,\"path\":\"/\"},\"flash\":{\"success\":[\"password matched\"]},\"passport\":{\"user\":6}}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscription`
--

DROP TABLE IF EXISTS `subscription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subscription` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subscriberId` int(11) NOT NULL,
  `publisherId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `subscriberId` (`subscriberId`),
  KEY `publisherId` (`publisherId`),
  CONSTRAINT `subscription_ibfk_1` FOREIGN KEY (`subscriberId`) REFERENCES `users` (`id`),
  CONSTRAINT `subscription_ibfk_2` FOREIGN KEY (`publisherId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscription`
--

LOCK TABLES `subscription` WRITE;
/*!40000 ALTER TABLE `subscription` DISABLE KEYS */;
/*!40000 ALTER TABLE `subscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fb_id` varchar(50) DEFAULT NULL,
  `photo` varchar(100) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT '',
  `friendsNum` int(5) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `fb_id` (`fb_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,NULL,'/daniel.jpg','Victor Wang','victor.wang@me.com','qwertyui','',0),(2,NULL,'/elliot.jpg','kevin','ya@gmail.com','hahaha','',0),(3,NULL,'/matthew.png','albert','ya@gmail.com','hahaha','',0),(4,NULL,'/rachel.png','umi','ya@gmail.com','hahaha','',0),(5,'2133742443306200','/daniel.jpg','Victor Wang','victor.wang@me.com',NULL,'',0),(6,NULL,'/elliot.jpg','Albert Chung','a@a.com','$2a$10$O3jLHnbpARP477j4YX7.i.BM1Of7zBMr/MOzSBiYa/nwNAsKMr4ES','',0),(7,NULL,'/rachel.png','Umi Hui','u@u.com','$2a$10$Lc1wza0daJm10AkSKnXmxufIfpegkPBS2ew56hrtj7PrpBhGVfeOe','',0),(8,NULL,'/matthew.png','Kevin Yeh','k@k.com','$2a$10$ehswgWIgcMvD4B5ceR6CFey.lkd/j1m4F2r7YDaxU1PAbOOyKV.BK','',0),(9,NULL,'/elliot.jpg','Victor Wang','v@v.com','$2a$10$fsmk80J.jPj/YEhAWACpouGGHBdG0E/HmiDNXUc5lf3sU.F6p..pa','',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-10-15 12:35:26
