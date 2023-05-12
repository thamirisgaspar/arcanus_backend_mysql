/*CREATE DATABASE ARCANUS;

USE ARCANUS;

CREATE TABLE USERS (
	id int not null auto_increment primary key,
    name varchar(255) not null,
    username varchar(255) not null,
    password varchar(150) not null,
	passwordResetToken varchar(50),
  	passwordResetExpires timestamp,
	admin boolean default false
);

CREATE TABLE ARCANUS(
	id int not null auto_increment primary key,
    userId int not null,
	charName varchar(150) not null,
	class varchar(100) not null,
	chronicle varchar(100) not null,
	xp int not null,
	background text
);

alter table arcanus add foreign key (userId) references users (id);

CREATE TABLE ATTRIBUTES (
	id int not null auto_increment primary key,
    arcanusId int not null,
	streight int not null,
	dexterity int not null,
	life int not null,
	charisma int not null,
	manipulation int not null,
	apearence int not null,
	perception int not null,
	intelligence int not null,
	reasoning int not null
);

alter table attributes add foreign key (arcanusId) references arcanus (id);

CREATE TABLE SKILLS (
	id int not null auto_increment primary key,
    arcanusId int not null,
	readness int,
	sports int,
	fight int,
	dodge int,
	empath int,
	expression int,
	intimidation int,
	leadership int,
	ruse int,
	lip int,
	animalEmpath int,
	trades int,
	conduction int,
	tag int,
	fireGun int,
	whiteArms int,
	perform int,
	security int,
	stealth int,
	survivor int,
	academic int,
	it int,
	financial int,
	investigation int,
	legal int,
	language int,
	medicine int,
	pagan int,
	government int,
	science int
);

alter table skills add foreign key (arcanusId) references arcanus (id);

CREATE TABLE magicaes (
	id int not null auto_increment primary key,
    arcanusId int not null,
	magicae varchar(150) not null,
	val int
);

alter table magicaes add foreign key (arcanusId) references arcanus (id);

CREATE TABLE OTHERS (
	id int not null auto_increment primary key,
    arcanusId int not null,
	sanity int,
	mana int,
	lifePoints int,
	bruised boolean default false,
	hurted boolean default false,
	injured boolean default false,
	seriously boolean default false,
	beaten boolean default false,
	crippled boolean default false,
	incapacitated boolean default false,
	unconscious boolean default false
);

alter table others add foreign key (arcanusId) references arcanus (id);

CREATE TABLE GRIMOIRE (
	id int not null auto_increment primary key,
    arcanusId int not null,
	animaMentia int,
	acquaDefensia int,
	ignisPotentia int,
	terraeResistentia int,
	ariaLiteratus int
);

alter table grimoire add foreign key (arcanusId) references arcanus (id);

CREATE TABLE NOTES (
	id int not null auto_increment primary key,
    arcanusId int not null,
	notes text
);*

alter table notes add foreign key (arcanusId) references arcanus (id);/