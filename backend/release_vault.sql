/*
 Navicat Premium Data Transfer

 Source Server         : Ubuntu_MySQL
 Source Server Type    : MySQL
 Source Server Version : 50729
 Source Host           : localhost:3306
 Source Schema         : release_vault

 Target Server Type    : MySQL
 Target Server Version : 50729
 File Encoding         : 65001

 Date: 31/03/2025 02:16:41
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for artist
-- ----------------------------
DROP TABLE IF EXISTS `artist`;
CREATE TABLE `artist`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `artist_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 196631 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of artist
-- ----------------------------
INSERT INTO `artist` VALUES (194, 'Various');
INSERT INTO `artist` VALUES (9749, 'The Beloved');
INSERT INTO `artist` VALUES (72872, 'Rick Astley');
INSERT INTO `artist` VALUES (87128, 'Passengers (2)');
INSERT INTO `artist` VALUES (196630, 'The Red Car And The Blue Car');

-- ----------------------------
-- Table structure for auth_group
-- ----------------------------
DROP TABLE IF EXISTS `auth_group`;
CREATE TABLE `auth_group`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `name`(`name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for auth_group_permissions
-- ----------------------------
DROP TABLE IF EXISTS `auth_group_permissions`;
CREATE TABLE `auth_group_permissions`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `auth_group_permissions_group_id_permission_id_0cd325b0_uniq`(`group_id`, `permission_id`) USING BTREE,
  INDEX `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm`(`permission_id`) USING BTREE,
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for auth_permission
-- ----------------------------
DROP TABLE IF EXISTS `auth_permission`;
CREATE TABLE `auth_permission`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `auth_permission_content_type_id_codename_01ab375a_uniq`(`content_type_id`, `codename`) USING BTREE,
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 57 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of auth_permission
-- ----------------------------
INSERT INTO `auth_permission` VALUES (1, 'Can add log entry', 1, 'add_logentry');
INSERT INTO `auth_permission` VALUES (2, 'Can change log entry', 1, 'change_logentry');
INSERT INTO `auth_permission` VALUES (3, 'Can delete log entry', 1, 'delete_logentry');
INSERT INTO `auth_permission` VALUES (4, 'Can view log entry', 1, 'view_logentry');
INSERT INTO `auth_permission` VALUES (5, 'Can add permission', 2, 'add_permission');
INSERT INTO `auth_permission` VALUES (6, 'Can change permission', 2, 'change_permission');
INSERT INTO `auth_permission` VALUES (7, 'Can delete permission', 2, 'delete_permission');
INSERT INTO `auth_permission` VALUES (8, 'Can view permission', 2, 'view_permission');
INSERT INTO `auth_permission` VALUES (9, 'Can add group', 3, 'add_group');
INSERT INTO `auth_permission` VALUES (10, 'Can change group', 3, 'change_group');
INSERT INTO `auth_permission` VALUES (11, 'Can delete group', 3, 'delete_group');
INSERT INTO `auth_permission` VALUES (12, 'Can view group', 3, 'view_group');
INSERT INTO `auth_permission` VALUES (13, 'Can add user', 4, 'add_user');
INSERT INTO `auth_permission` VALUES (14, 'Can change user', 4, 'change_user');
INSERT INTO `auth_permission` VALUES (15, 'Can delete user', 4, 'delete_user');
INSERT INTO `auth_permission` VALUES (16, 'Can view user', 4, 'view_user');
INSERT INTO `auth_permission` VALUES (17, 'Can add content type', 5, 'add_contenttype');
INSERT INTO `auth_permission` VALUES (18, 'Can change content type', 5, 'change_contenttype');
INSERT INTO `auth_permission` VALUES (19, 'Can delete content type', 5, 'delete_contenttype');
INSERT INTO `auth_permission` VALUES (20, 'Can view content type', 5, 'view_contenttype');
INSERT INTO `auth_permission` VALUES (21, 'Can add session', 6, 'add_session');
INSERT INTO `auth_permission` VALUES (22, 'Can change session', 6, 'change_session');
INSERT INTO `auth_permission` VALUES (23, 'Can delete session', 6, 'delete_session');
INSERT INTO `auth_permission` VALUES (24, 'Can view session', 6, 'view_session');
INSERT INTO `auth_permission` VALUES (25, 'Can add Artist', 7, 'add_artist');
INSERT INTO `auth_permission` VALUES (26, 'Can change Artist', 7, 'change_artist');
INSERT INTO `auth_permission` VALUES (27, 'Can delete Artist', 7, 'delete_artist');
INSERT INTO `auth_permission` VALUES (28, 'Can view Artist', 7, 'view_artist');
INSERT INTO `auth_permission` VALUES (29, 'Can add Genre', 8, 'add_genre');
INSERT INTO `auth_permission` VALUES (30, 'Can change Genre', 8, 'change_genre');
INSERT INTO `auth_permission` VALUES (31, 'Can delete Genre', 8, 'delete_genre');
INSERT INTO `auth_permission` VALUES (32, 'Can view Genre', 8, 'view_genre');
INSERT INTO `auth_permission` VALUES (33, 'Can add Master Release', 9, 'add_masterrelease');
INSERT INTO `auth_permission` VALUES (34, 'Can change Master Release', 9, 'change_masterrelease');
INSERT INTO `auth_permission` VALUES (35, 'Can delete Master Release', 9, 'delete_masterrelease');
INSERT INTO `auth_permission` VALUES (36, 'Can view Master Release', 9, 'view_masterrelease');
INSERT INTO `auth_permission` VALUES (37, 'Can add Release', 10, 'add_release');
INSERT INTO `auth_permission` VALUES (38, 'Can change Release', 10, 'change_release');
INSERT INTO `auth_permission` VALUES (39, 'Can delete Release', 10, 'delete_release');
INSERT INTO `auth_permission` VALUES (40, 'Can view Release', 10, 'view_release');
INSERT INTO `auth_permission` VALUES (41, 'Can add User', 11, 'add_user');
INSERT INTO `auth_permission` VALUES (42, 'Can change User', 11, 'change_user');
INSERT INTO `auth_permission` VALUES (43, 'Can delete User', 11, 'delete_user');
INSERT INTO `auth_permission` VALUES (44, 'Can view User', 11, 'view_user');
INSERT INTO `auth_permission` VALUES (45, 'Can add Wantlist Entry', 12, 'add_wantlist');
INSERT INTO `auth_permission` VALUES (46, 'Can change Wantlist Entry', 12, 'change_wantlist');
INSERT INTO `auth_permission` VALUES (47, 'Can delete Wantlist Entry', 12, 'delete_wantlist');
INSERT INTO `auth_permission` VALUES (48, 'Can view Wantlist Entry', 12, 'view_wantlist');
INSERT INTO `auth_permission` VALUES (49, 'Can add Collection Record', 13, 'add_collection');
INSERT INTO `auth_permission` VALUES (50, 'Can change Collection Record', 13, 'change_collection');
INSERT INTO `auth_permission` VALUES (51, 'Can delete Collection Record', 13, 'delete_collection');
INSERT INTO `auth_permission` VALUES (52, 'Can view Collection Record', 13, 'view_collection');
INSERT INTO `auth_permission` VALUES (53, 'Can add Release-Genre Mapping', 14, 'add_releasegenre');
INSERT INTO `auth_permission` VALUES (54, 'Can change Release-Genre Mapping', 14, 'change_releasegenre');
INSERT INTO `auth_permission` VALUES (55, 'Can delete Release-Genre Mapping', 14, 'delete_releasegenre');
INSERT INTO `auth_permission` VALUES (56, 'Can view Release-Genre Mapping', 14, 'view_releasegenre');

-- ----------------------------
-- Table structure for auth_user
-- ----------------------------
DROP TABLE IF EXISTS `auth_user`;
CREATE TABLE `auth_user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `last_login` datetime(6) NULL DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `first_name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `last_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `email` varchar(254) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for auth_user_groups
-- ----------------------------
DROP TABLE IF EXISTS `auth_user_groups`;
CREATE TABLE `auth_user_groups`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `auth_user_groups_user_id_group_id_94350c0c_uniq`(`user_id`, `group_id`) USING BTREE,
  INDEX `auth_user_groups_group_id_97559544_fk_auth_group_id`(`group_id`) USING BTREE,
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for auth_user_user_permissions
-- ----------------------------
DROP TABLE IF EXISTS `auth_user_user_permissions`;
CREATE TABLE `auth_user_user_permissions`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq`(`user_id`, `permission_id`) USING BTREE,
  INDEX `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm`(`permission_id`) USING BTREE,
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for collection
-- ----------------------------
DROP TABLE IF EXISTS `collection`;
CREATE TABLE `collection`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quantity` int(11) NOT NULL,
  `purchase_price` decimal(10, 2) NOT NULL,
  `purchase_date` datetime(6) NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL,
  `release_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `collection_release_id_b1e3eb6c_fk_release_id`(`release_id`) USING BTREE,
  INDEX `collection_user_id_e8aa841d_fk_user_id`(`user_id`) USING BTREE,
  CONSTRAINT `collection_release_id_b1e3eb6c_fk_release_id` FOREIGN KEY (`release_id`) REFERENCES `release` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `collection_user_id_e8aa841d_fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of collection
-- ----------------------------
INSERT INTO `collection` VALUES (1, 2, 39.99, '2025-03-30 03:19:03.000000', 'like', 249504, 1);
INSERT INTO `collection` VALUES (2, 1, 29.99, '2025-03-30 05:19:03.509365', 'like', 249508, 1);
INSERT INTO `collection` VALUES (4, 1, 49.99, '2025-03-30 06:09:16.002750', 'like', 249509, 1);
INSERT INTO `collection` VALUES (5, 1, 29.99, '2025-03-30 07:34:53.161043', 'like', 249302, 1);

-- ----------------------------
-- Table structure for django_admin_log
-- ----------------------------
DROP TABLE IF EXISTS `django_admin_log`;
CREATE TABLE `django_admin_log`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL,
  `object_repr` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `action_flag` smallint(5) UNSIGNED NOT NULL,
  `change_message` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `content_type_id` int(11) NULL DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `django_admin_log_content_type_id_c4bce8eb_fk_django_co`(`content_type_id`) USING BTREE,
  INDEX `django_admin_log_user_id_c564eba6_fk_auth_user_id`(`user_id`) USING BTREE,
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for django_content_type
-- ----------------------------
DROP TABLE IF EXISTS `django_content_type`;
CREATE TABLE `django_content_type`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `model` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `django_content_type_app_label_model_76bd3d3b_uniq`(`app_label`, `model`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of django_content_type
-- ----------------------------
INSERT INTO `django_content_type` VALUES (7, 'Core_Configuration', 'artist');
INSERT INTO `django_content_type` VALUES (13, 'Core_Configuration', 'collection');
INSERT INTO `django_content_type` VALUES (8, 'Core_Configuration', 'genre');
INSERT INTO `django_content_type` VALUES (9, 'Core_Configuration', 'masterrelease');
INSERT INTO `django_content_type` VALUES (10, 'Core_Configuration', 'release');
INSERT INTO `django_content_type` VALUES (14, 'Core_Configuration', 'releasegenre');
INSERT INTO `django_content_type` VALUES (11, 'Core_Configuration', 'user');
INSERT INTO `django_content_type` VALUES (12, 'Core_Configuration', 'wantlist');
INSERT INTO `django_content_type` VALUES (1, 'admin', 'logentry');
INSERT INTO `django_content_type` VALUES (3, 'auth', 'group');
INSERT INTO `django_content_type` VALUES (2, 'auth', 'permission');
INSERT INTO `django_content_type` VALUES (4, 'auth', 'user');
INSERT INTO `django_content_type` VALUES (5, 'contenttypes', 'contenttype');
INSERT INTO `django_content_type` VALUES (6, 'sessions', 'session');

-- ----------------------------
-- Table structure for django_migrations
-- ----------------------------
DROP TABLE IF EXISTS `django_migrations`;
CREATE TABLE `django_migrations`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of django_migrations
-- ----------------------------
INSERT INTO `django_migrations` VALUES (1, 'Core_Configuration', '0001_initial', '2025-03-30 00:39:42.733227');
INSERT INTO `django_migrations` VALUES (2, 'contenttypes', '0001_initial', '2025-03-30 00:39:43.049547');
INSERT INTO `django_migrations` VALUES (3, 'auth', '0001_initial', '2025-03-30 00:39:43.214704');
INSERT INTO `django_migrations` VALUES (4, 'admin', '0001_initial', '2025-03-30 00:39:43.474583');
INSERT INTO `django_migrations` VALUES (5, 'admin', '0002_logentry_remove_auto_add', '2025-03-30 00:39:43.541970');
INSERT INTO `django_migrations` VALUES (6, 'admin', '0003_logentry_add_action_flag_choices', '2025-03-30 00:39:43.541970');
INSERT INTO `django_migrations` VALUES (7, 'contenttypes', '0002_remove_content_type_name', '2025-03-30 00:39:43.600692');
INSERT INTO `django_migrations` VALUES (8, 'auth', '0002_alter_permission_name_max_length', '2025-03-30 00:39:43.632816');
INSERT INTO `django_migrations` VALUES (9, 'auth', '0003_alter_user_email_max_length', '2025-03-30 00:39:43.648457');
INSERT INTO `django_migrations` VALUES (10, 'auth', '0004_alter_user_username_opts', '2025-03-30 00:39:43.648457');
INSERT INTO `django_migrations` VALUES (11, 'auth', '0005_alter_user_last_login_null', '2025-03-30 00:39:43.679700');
INSERT INTO `django_migrations` VALUES (12, 'auth', '0006_require_contenttypes_0002', '2025-03-30 00:39:43.679700');
INSERT INTO `django_migrations` VALUES (13, 'auth', '0007_alter_validators_add_error_messages', '2025-03-30 00:39:43.695316');
INSERT INTO `django_migrations` VALUES (14, 'auth', '0008_alter_user_username_max_length', '2025-03-30 00:39:43.726573');
INSERT INTO `django_migrations` VALUES (15, 'auth', '0009_alter_user_last_name_max_length', '2025-03-30 00:39:43.758225');
INSERT INTO `django_migrations` VALUES (16, 'auth', '0010_alter_group_name_max_length', '2025-03-30 00:39:43.773867');
INSERT INTO `django_migrations` VALUES (17, 'auth', '0011_update_proxy_permissions', '2025-03-30 00:39:43.773867');
INSERT INTO `django_migrations` VALUES (18, 'sessions', '0001_initial', '2025-03-30 00:39:43.805102');
INSERT INTO `django_migrations` VALUES (19, 'Core_Configuration', '0002_auto_20250330_0054', '2025-03-30 00:55:28.376268');

-- ----------------------------
-- Table structure for django_session
-- ----------------------------
DROP TABLE IF EXISTS `django_session`;
CREATE TABLE `django_session`  (
  `session_key` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `session_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`) USING BTREE,
  INDEX `django_session_expire_date_a5c62663`(`expire_date`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for genre
-- ----------------------------
DROP TABLE IF EXISTS `genre`;
CREATE TABLE `genre`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `genre_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `genre_name`(`genre_name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of genre
-- ----------------------------
INSERT INTO `genre` VALUES (1, 'Electronic');
INSERT INTO `genre` VALUES (2, 'Pop');

-- ----------------------------
-- Table structure for master_release
-- ----------------------------
DROP TABLE IF EXISTS `master_release`;
CREATE TABLE `master_release`  (
  `id` int(11) NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `artist_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `master_release_artist_id_b558fff7_fk_artist_id`(`artist_id`) USING BTREE,
  CONSTRAINT `master_release_artist_id_b558fff7_fk_artist_id` FOREIGN KEY (`artist_id`) REFERENCES `artist` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of master_release
-- ----------------------------
INSERT INTO `master_release` VALUES (10484, 'Sweet Harmony', 9749);
INSERT INTO `master_release` VALUES (92605, 'Heaven ‎– Deep Trance Essentials 2', 194);
INSERT INTO `master_release` VALUES (96559, 'Never Gonna Give You Up', 72872);
INSERT INTO `master_release` VALUES (101762, 'Casinò', 87128);
INSERT INTO `master_release` VALUES (638016, 'Home For Christmas Day', 196630);

-- ----------------------------
-- Table structure for release
-- ----------------------------
DROP TABLE IF EXISTS `release`;
CREATE TABLE `release`  (
  `id` int(11) NOT NULL,
  `discogs_id` int(11) NULL DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `release_year` smallint(5) UNSIGNED NULL DEFAULT NULL,
  `format` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `cover_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `artist_id` int(11) NULL DEFAULT NULL,
  `master_id` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `release_artist_id_6d6fdb6b_fk_artist_id`(`artist_id`) USING BTREE,
  INDEX `release_master_id_b2e95c8b_fk_master_release_id`(`master_id`) USING BTREE,
  CONSTRAINT `release_artist_id_6d6fdb6b_fk_artist_id` FOREIGN KEY (`artist_id`) REFERENCES `artist` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `release_master_id_b2e95c8b_fk_master_release_id` FOREIGN KEY (`master_id`) REFERENCES `master_release` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of release
-- ----------------------------
INSERT INTO `release` VALUES (249302, 249302, 'Casinò', 1981, 'Vinyl', 'https://i.discogs.com/Uw0GwJMrgdz2SNCpz5SC-cbUEUyKh4TOXLbpLhM-SjE/rs:fit/g:sm/q:40/h:150/w:150/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI0OTMw/Mi0xMzgwNjE5MjYw/LTM1NzQuanBlZw.jpeg', 87128, 101762);
INSERT INTO `release` VALUES (249502, 249502, 'Demulcent Sessions Volume 1', 2003, 'CD', 'https://i.discogs.com/D2BGZEsrq9JNgDlZ0ntjWIj9_h5ln1g2bmMMdw7E0lA/rs:fit/g:sm/q:40/h:150/w:150/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI0OTUw/Mi0xMDgzMzYxOTE3/LmpwZw.jpeg', 194, NULL);
INSERT INTO `release` VALUES (249504, 249504, 'Never Gonna Give You Up', 1987, 'Vinyl', 'https://i.discogs.com/HG2xChKN-rIHHSfgL53W9z2vJWeFknfevpOMwSHtIaM/rs:fit/g:sm/q:40/h:150/w:150/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI0OTUw/NC0xMzM0NTkyMjEy/LmpwZWc.jpeg', 72872, 96559);
INSERT INTO `release` VALUES (249505, 249505, 'Sweet Harmony', 1993, 'Vinyl', 'https://i.discogs.com/4c9hkugsQxl_bJCfKKf6YF4_m_bZ4QkWGaKYuVEQkic/rs:fit/g:sm/q:40/h:150/w:150/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI0OTUw/NS0xMzQ2Njg3OTQ0/LTU2NTIuanBlZw.jpeg', 9749, 10484);
INSERT INTO `release` VALUES (249508, 249508, 'Heaven ‎– Deep Trance Essentials 2', 2004, 'Vinyl', 'https://i.discogs.com/dPPiKLJSiwRN4Chh1mQoUDAo_uF09VTGhanZ30GyeKQ/rs:fit/g:sm/q:40/h:150/w:150/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI0OTUw/OC0xMTkwMzIwNTY5/LmpwZWc.jpeg', 194, 92605);
INSERT INTO `release` VALUES (249509, 249509, 'Home For Christmas Day', 1991, 'Cassette', 'https://i.discogs.com/qWK5Gl2TaK73r-9DXxcNQwcFLzbCY5NI3Xs-7WKt79M/rs:fit/g:sm/q:40/h:150/w:150/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI0OTUw/OS0xMDgzMzU1MTM2/LmpwZw.jpeg', 196630, 638016);

-- ----------------------------
-- Table structure for release_genre
-- ----------------------------
DROP TABLE IF EXISTS `release_genre`;
CREATE TABLE `release_genre`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `genre_id` int(11) NOT NULL,
  `release_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `release_genre_release_id_genre_id_825a2b7e_uniq`(`release_id`, `genre_id`) USING BTREE,
  INDEX `release_genre_genre_id_2da7b836_fk_genre_id`(`genre_id`) USING BTREE,
  CONSTRAINT `release_genre_genre_id_2da7b836_fk_genre_id` FOREIGN KEY (`genre_id`) REFERENCES `genre` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `release_genre_release_id_5af7a333_fk_release_id` FOREIGN KEY (`release_id`) REFERENCES `release` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of release_genre
-- ----------------------------
INSERT INTO `release_genre` VALUES (6, 1, 249302);
INSERT INTO `release_genre` VALUES (4, 1, 249502);
INSERT INTO `release_genre` VALUES (1, 1, 249505);
INSERT INTO `release_genre` VALUES (2, 2, 249505);
INSERT INTO `release_genre` VALUES (3, 1, 249508);
INSERT INTO `release_genre` VALUES (5, 1, 249509);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `password` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'testuser1', 'test1@example.com', '482c811da5d5b4bc6d497ffa98491e38');
INSERT INTO `user` VALUES (2, 'testuser2', '', 'e10adc3949ba59abbe56e057f20f883e');

-- ----------------------------
-- Table structure for wantlist
-- ----------------------------
DROP TABLE IF EXISTS `wantlist`;
CREATE TABLE `wantlist`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `added_date` datetime(6) NOT NULL,
  `note` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL,
  `release_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `wantlist_release_id_1388a105_fk_release_id`(`release_id`) USING BTREE,
  INDEX `wantlist_user_id_672efa53_fk_user_id`(`user_id`) USING BTREE,
  CONSTRAINT `wantlist_release_id_1388a105_fk_release_id` FOREIGN KEY (`release_id`) REFERENCES `release` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `wantlist_user_id_672efa53_fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of wantlist
-- ----------------------------
INSERT INTO `wantlist` VALUES (1, '2025-03-30 05:58:51.859797', 'like', 249508, 1);

SET FOREIGN_KEY_CHECKS = 1;
