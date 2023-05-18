/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50620
Source Host           : localhost:3306
Source Database       : book_db

Target Server Type    : MYSQL
Target Server Version : 50620
File Encoding         : 65001

Date: 2019-09-19 21:09:20
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `t_admin`
-- ----------------------------
DROP TABLE IF EXISTS `t_admin`;
CREATE TABLE `t_admin` (
  `username` varchar(20) NOT NULL DEFAULT '',
  `password` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_admin
-- ----------------------------
INSERT INTO `t_admin` VALUES ('a', 'a');

-- ----------------------------
-- Table structure for `t_book`
-- ----------------------------
DROP TABLE IF EXISTS `t_book`;
CREATE TABLE `t_book` (
  `barcode` varchar(20) NOT NULL COMMENT 'barcode',
  `bookName` varchar(20) NOT NULL COMMENT '图书名称',
  `bookTypeObj` int(11) NOT NULL COMMENT '图书所在类别',
  `price` float NOT NULL COMMENT '图书价格',
  `count` int(11) NOT NULL COMMENT '库存',
  `publishDate` varchar(20) DEFAULT NULL COMMENT '出版日期',
  `publish` varchar(20) DEFAULT NULL COMMENT '出版社',
  `bookPhoto` varchar(60) NOT NULL COMMENT '图书图片',
  `bookDesc` varchar(8000) DEFAULT NULL COMMENT '图书简介',
  PRIMARY KEY (`barcode`),
  KEY `bookTypeObj` (`bookTypeObj`),
  CONSTRAINT `t_book_ibfk_1` FOREIGN KEY (`bookTypeObj`) REFERENCES `t_booktype` (`bookTypeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_book
-- ----------------------------
INSERT INTO `t_book` VALUES ('TS001', 'Python网络编程', '1', '38.5', '12', '2019-09-10', '人民教育出版社', 'img/pythonwl.jpg', '<p style=\"box-sizing: border-box; margin-top: 0px; margin-bottom: 20px; word-break: break-word; color: #404040; font-family: -apple-system, BlinkMacSystemFont, \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Segoe UI Symbol\', \'Segoe UI\', \'PingFang SC\', \'Hiragino Sans GB\', \'Microsoft YaHei\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-size: 16px;\">推荐非常适合入门神经网络编程的一本书《Python神经网络编程》，主要是三部分： 介绍神经网络的基本原理和知识；用Python写一个神经网络训练识别手写数字；对识别手写数字的程序的一些优化。</p>\r\n<p style=\"box-sizing: border-box; margin-top: 0px; margin-bottom: 20px; word-break: break-word; color: #404040; font-family: -apple-system, BlinkMacSystemFont, \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Segoe UI Symbol\', \'Segoe UI\', \'PingFang SC\', \'Hiragino Sans GB\', \'Microsoft YaHei\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-size: 16px;\">清晰易懂，只用了一点数学（目标读者是高中生，书中稍许用到的微积分知识，在附录也有解释），就把神经网络的构造和原理讲得很清楚。讲完理论，作者在书的第二部分进入实践，一步步编写了一段应用神经网络模型识别手写数字的代码，几乎每一步都伴有详细讲解。个人感觉是，如果预先有一点点python的知识，会更容易理解这些代码。第三部分篇幅不长，主要是在某些方面略作延伸，意图应该是希望激发读者进一步探究的兴趣。书中的计算和公式偶有小错误，基本都能通过上下文发现。</p>');
INSERT INTO `t_book` VALUES ('TS002', 'PHP从入门到精通', '1', '42.5', '20', '2019-09-03', '四川大学出版社', 'img/phpweb.jpg', '<p style=\"margin: 10px 0px 0px; padding: 0px; color: #444444; font-family: Arial, Tahoma, Helvetica, 宋体;\"><strong><a style=\"color: #2a78b4; text-decoration-line: none;\" href=\"http://www.downcc.com/k/php/\" target=\"_blank\">php</a>7<a style=\"color: #2a78b4; text-decoration-line: none;\" href=\"http://www.downcc.com/k/crmdjt/\" target=\"_blank\">从入门到精通</a>&nbsp;pdf</strong>是一个完整免费的<a style=\"color: #2a78b4; text-decoration-line: none;\" href=\"http://www.downcc.com/k/phpjjiaocheng/\" target=\"_blank\">php教程</a>文档。图书内容讲述全面，语言描述的简单易懂，通过举例为php7程序使用者提供通俗易懂的教学服务。本站提供的免费文档中同时附带了视频教程，欢迎各位来绿色资源网下载使用。</p>\r\n<h3 style=\"margin: 10px 0px 0px; padding: 0px 0px 0px 10px; font-size: 14px; color: #41b80f; line-height: 28px; background: #f7fbff; border: 1px solid #e5f2ff; font-family: Arial, Tahoma, Helvetica, 宋体;\">PHP7从入门到精通（视频教学版）介绍</h3>\r\n<p style=\"margin: 10px 0px 0px; padding: 0px; color: #444444; font-family: Arial, Tahoma, Helvetica, 宋体;\">全书共23章，分别介绍了HP7的基本概念、PHP服务器环境配置、PHP的基本语法、PHP的语言结构、字符串和<a style=\"color: #2a78b4; text-decoration-line: none;\" href=\"http://www.downcc.com/k/zhengzebiaodasi/\" target=\"_blank\">正则表达式</a>、数组、时间和日期、面向对象编程、错误处理和异常处理、PHP与Web页面交互、文件与目录操作、图形<a style=\"color: #2a78b4; text-decoration-line: none;\" href=\"http://www.downcc.com/k/txclrj/\" target=\"_blank\">图像处理</a>、Cookie和会话管理、MySQL<a style=\"color: #2a78b4; text-decoration-line: none;\" href=\"http://www.downcc.com/k/sql/\" target=\"_blank\">数据库</a>基础、PHP操作MySQL数据库、PDO数据库抽象类库、JavaScript编程基础、PHP与XML技术、PHP与Ajax的综合应用、Smarty模板、Zendframework框架等，最后通过一个<a style=\"color: #2a78b4; text-decoration-line: none;\" href=\"http://www.downcc.com/k/luntanapp/\" target=\"_blank\">论坛</a>系统实战案例和一个<a style=\"color: #2a78b4; text-decoration-line: none;\" href=\"http://www.downcc.com/k/jdgrj/\" target=\"_blank\">酒店管理系统</a>实战案例，使<a style=\"color: #2a78b4; text-decoration-line: none;\" href=\"http://www.downcc.com/k/duzhe/\" target=\"_blank\">读者</a>进一步巩固所学的知识，提高综合实战能力。</p>\r\n<p style=\"margin: 10px 0px 0px; padding: 0px; color: #444444; font-family: Arial, Tahoma, Helvetica, 宋体; text-align: center;\">本书内容丰富全面，图文并茂，步骤清晰，语言通俗易懂，使读者能理解PHP网站开发的技术构成，并能解决实际生活或工作中的问题，真正做到知其然，更知其所以然。通过重点章节，条理清晰地介绍了读者希望了解的知识，对PHP网站开发有兴趣的读者可以快速上手设计和制作动态网站。</p>\r\n<p style=\"margin: 10px 0px 0px; padding: 0px; color: #444444; font-family: Arial, Tahoma, Helvetica, 宋体;\">本书适合任何想学习PHP的人员--无论你是否从事计算机相关行业、是否接触过PHP，都可以通过本书的学习快速、全面地掌握PHP开发方本书几乎涉及PHP网站开发的所有重要知识，适合所有的PHP网站开发初学者快速入门，同时也适合想全面了解PHP+MySQL网站开发的人员阅读。通过全书的学习，读者可以完整地掌握PHP网站开发的技术要点，并具备动态网站开发的基本技术。</p>');
INSERT INTO `t_book` VALUES ('TS003', '中国近代史', '2', '28.5', '35', '2019-09-08', '人民教育出版社', 'img/jindaishi.jpg', '<p><span style=\"color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei\', arial, 宋体, sans-serif, tahoma; font-size: 16px;\">第一讲　 中国近代政治史开场白</span><br style=\"content: &quot;\'; display: block; width: 705px; height: 0px; margin: 0px; color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei&quot;, arial, 宋体, sans-serif, tahoma; font-size: 16px;\" /><span style=\"color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei\', arial, 宋体, sans-serif, tahoma; font-size: 16px;\">对于近代史的&ldquo;三妇&rdquo;心态</span><br style=\"content: &quot;\'; display: block; width: 705px; height: 0px; margin: 0px; color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei&quot;, arial, 宋体, sans-serif, tahoma; font-size: 16px;\" /><span style=\"color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei\', arial, 宋体, sans-serif, tahoma; font-size: 16px;\">中西两种体系</span><br style=\"content: &quot;\'; display: block; width: 705px; height: 0px; margin: 0px; color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei&quot;, arial, 宋体, sans-serif, tahoma; font-size: 16px;\" /><span style=\"color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei\', arial, 宋体, sans-serif, tahoma; font-size: 16px;\">中国的抵抗</span><br style=\"content: &quot;\'; display: block; width: 705px; height: 0px; margin: 0px; color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei&quot;, arial, 宋体, sans-serif, tahoma; font-size: 16px;\" /><span style=\"color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei\', arial, 宋体, sans-serif, tahoma; font-size: 16px;\">第二讲　两个世界最初的碰撞</span><br style=\"content: &quot;\'; display: block; width: 705px; height: 0px; margin: 0px; color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei&quot;, arial, 宋体, sans-serif, tahoma; font-size: 16px;\" /><span style=\"color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei\', arial, 宋体, sans-serif, tahoma; font-size: 16px;\">中西近代史的不同开端</span><br style=\"content: &quot;\'; display: block; width: 705px; height: 0px; margin: 0px; color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei&quot;, arial, 宋体, sans-serif, tahoma; font-size: 16px;\" /><span style=\"color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei\', arial, 宋体, sans-serif, tahoma; font-size: 16px;\">中国和英国的第一次直接碰撞</span><br style=\"content: &quot;\'; display: block; width: 705px; height: 0px; margin: 0px; color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei&quot;, arial, 宋体, sans-serif, tahoma; font-size: 16px;\" /><span style=\"color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei\', arial, 宋体, sans-serif, tahoma; font-size: 16px;\">鸦片</span><span style=\"color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei\', arial, 宋体, sans-serif, tahoma; font-size: 16px;\">&mdash;&mdash;打破中英贸易结构的不平衡</span><br style=\"content: &quot;\'; display: block; width: 705px; height: 0px; margin: 0px; color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei&quot;, arial, 宋体, sans-serif, tahoma; font-size: 16px;\" /><span style=\"color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei\', arial, 宋体, sans-serif, tahoma; font-size: 16px;\">第三讲　两个世界最初的碰撞（续）</span><br style=\"content: &quot;\'; display: block; width: 705px; height: 0px; margin: 0px; color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei&quot;, arial, 宋体, sans-serif, tahoma; font-size: 16px;\" /><span style=\"color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei\', arial, 宋体, sans-serif, tahoma; font-size: 16px;\">英国对中国政策的成本核算</span><br style=\"content: &quot;\'; display: block; width: 705px; height: 0px; margin: 0px; color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei&quot;, arial, 宋体, sans-serif, tahoma; font-size: 16px;\" /><span style=\"color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei\', arial, 宋体, sans-serif, tahoma; font-size: 16px;\">中英的战争技术和战略对比</span><br style=\"content: &quot;\'; display: block; width: 705px; height: 0px; margin: 0px; color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei&quot;, arial, 宋体, sans-serif, tahoma; font-size: 16px;\" /><span style=\"color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei\', arial, 宋体, sans-serif, tahoma; font-size: 16px;\">开放教禁带来了西方的输入</span><br style=\"content: &quot;\'; display: block; width: 705px; height: 0px; margin: 0px; color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei&quot;, arial, 宋体, sans-serif, tahoma; font-size: 16px;\" /><span style=\"color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei\', arial, 宋体, sans-serif, tahoma; font-size: 16px;\">传统历史缔造的两个神话</span><br style=\"content: &quot;\'; display: block; width: 705px; height: 0px; margin: 0px; color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei&quot;, arial, 宋体, sans-serif, tahoma; font-size: 16px;\" /><span style=\"color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei\', arial, 宋体, sans-serif, tahoma; font-size: 16px;\">中国近代化的第一步</span><br style=\"content: &quot;\'; display: block; width: 705px; height: 0px; margin: 0px; color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei&quot;, arial, 宋体, sans-serif, tahoma; font-size: 16px;\" /><span style=\"color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei\', arial, 宋体, sans-serif, tahoma; font-size: 16px;\">第二次鸦片战争</span><br style=\"content: &quot;\'; display: block; width: 705px; height: 0px; margin: 0px; color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei&quot;, arial, 宋体, sans-serif, tahoma; font-size: 16px;\" /><span style=\"color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei\', arial, 宋体, sans-serif, tahoma; font-size: 16px;\">第四讲　帝国古老命题新解</span><br style=\"content: &quot;\'; display: block; width: 705px; height: 0px; margin: 0px; color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei&quot;, arial, 宋体, sans-serif, tahoma; font-size: 16px;\" /><span style=\"color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei\', arial, 宋体, sans-serif, tahoma; font-size: 16px;\">关于太平天国起义原因的商榷</span><br style=\"content: &quot;\'; display: block; width: 705px; height: 0px; margin: 0px; color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei&quot;, arial, 宋体, sans-serif, tahoma; font-size: 16px;\" /><span style=\"color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei\', arial, 宋体, sans-serif, tahoma; font-size: 16px;\">清末统治的主要问题</span><br style=\"content: &quot;\'; display: block; width: 705px; height: 0px; margin: 0px; color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei&quot;, arial, 宋体, sans-serif, tahoma; font-size: 16px;\" /><span style=\"color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei\', arial, 宋体, sans-serif, tahoma; font-size: 16px;\">洪秀全创教史</span><br style=\"content: &quot;\'; display: block; width: 705px; height: 0px; margin: 0px; color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei&quot;, arial, 宋体, sans-serif, tahoma; font-size: 16px;\" /><span style=\"color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei\', arial, 宋体, sans-serif, tahoma; font-size: 16px;\">太平军起义</span><br style=\"content: &quot;\'; display: block; width: 705px; height: 0px; margin: 0px; color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei&quot;, arial, 宋体, sans-serif, tahoma; font-size: 16px;\" /><span style=\"color: #333333; font-family: \'PingFang SC\', \'Lantinghei SC\', \'Microsoft YaHei\', arial, 宋体, sans-serif, tahoma; font-size: 16px;\">太平军的问题</span><br style=\"content: &quot;\'; display: block; width: 705');

-- ----------------------------
-- Table structure for `t_booktype`
-- ----------------------------
DROP TABLE IF EXISTS `t_booktype`;
CREATE TABLE `t_booktype` (
  `bookTypeId` int(11) NOT NULL AUTO_INCREMENT COMMENT '图书类别',
  `bookTypeName` varchar(18) NOT NULL COMMENT '类别名称',
  `days` int(11) NOT NULL COMMENT '可借阅天数',
  PRIMARY KEY (`bookTypeId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_booktype
-- ----------------------------
INSERT INTO `t_booktype` VALUES ('1', '计算机类', '30');
INSERT INTO `t_booktype` VALUES ('2', '历史类', '25');

-- ----------------------------
-- Table structure for `t_loaninfo`
-- ----------------------------
DROP TABLE IF EXISTS `t_loaninfo`;
CREATE TABLE `t_loaninfo` (
  `loadId` int(11) NOT NULL AUTO_INCREMENT COMMENT '借阅编号',
  `book` varchar(20) NOT NULL COMMENT '图书对象',
  `reader` varchar(20) NOT NULL COMMENT '读者对象',
  `borrowDate` varchar(20) DEFAULT NULL COMMENT '借阅时间',
  `returnDate` varchar(20) DEFAULT NULL COMMENT '归还时间',
  PRIMARY KEY (`loadId`),
  KEY `book` (`book`),
  KEY `reader` (`reader`),
  CONSTRAINT `t_loaninfo_ibfk_1` FOREIGN KEY (`book`) REFERENCES `t_book` (`barcode`),
  CONSTRAINT `t_loaninfo_ibfk_2` FOREIGN KEY (`reader`) REFERENCES `t_reader` (`readerNo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_loaninfo
-- ----------------------------
INSERT INTO `t_loaninfo` VALUES ('1', 'TS001', 'DZ001', '2019-09-11 20:04:47', '2019-09-19 20:04:51');
INSERT INTO `t_loaninfo` VALUES ('2', 'TS002', 'DZ002', '2019-09-18 20:36:38', '2019-09-19 20:36:29');
INSERT INTO `t_loaninfo` VALUES ('3', 'TS003', 'DZ002', '2019-09-10 20:39:30', '--');

-- ----------------------------
-- Table structure for `t_reader`
-- ----------------------------
DROP TABLE IF EXISTS `t_reader`;
CREATE TABLE `t_reader` (
  `readerNo` varchar(20) NOT NULL COMMENT 'readerNo',
  `password` varchar(20) DEFAULT NULL COMMENT '登录密码',
  `readerTypeObj` int(11) NOT NULL COMMENT '读者类型',
  `readerName` varchar(20) NOT NULL COMMENT '姓名',
  `sex` varchar(2) NOT NULL COMMENT '性别',
  `birthday` varchar(20) DEFAULT NULL COMMENT '读者生日',
  `telephone` varchar(20) DEFAULT NULL COMMENT '联系电话',
  `email` varchar(50) DEFAULT NULL COMMENT '联系Email',
  `address` varchar(80) DEFAULT NULL COMMENT '读者地址',
  `photo` varchar(60) NOT NULL COMMENT '读者头像',
  PRIMARY KEY (`readerNo`),
  KEY `readerTypeObj` (`readerTypeObj`),
  CONSTRAINT `t_reader_ibfk_1` FOREIGN KEY (`readerTypeObj`) REFERENCES `t_readertype` (`readerTypeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_reader
-- ----------------------------
INSERT INTO `t_reader` VALUES ('DZ001', '123', '1', '王铮', '女', '2019-09-03', '13430812342', 'wangzheng@126.com', '四川达州冰河路10号', 'img/1.jpg');
INSERT INTO `t_reader` VALUES ('DZ002', '123', '2', '张霞', '女', '2019-09-11', '13980183084', 'zhangxia@126.com', '四川成都红星路', 'img/2.jpg');

-- ----------------------------
-- Table structure for `t_readertype`
-- ----------------------------
DROP TABLE IF EXISTS `t_readertype`;
CREATE TABLE `t_readertype` (
  `readerTypeId` int(11) NOT NULL AUTO_INCREMENT COMMENT '读者类型编号',
  `readerTypeName` varchar(20) NOT NULL COMMENT '读者类型',
  `number` int(11) NOT NULL COMMENT '可借阅数目',
  PRIMARY KEY (`readerTypeId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_readertype
-- ----------------------------
INSERT INTO `t_readertype` VALUES ('1', '老师类', '5');
INSERT INTO `t_readertype` VALUES ('2', '学生类', '3');
