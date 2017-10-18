# breed
project for simudyne


# database

I'm using sqlite for storing the data
structure :
CREATE TABLE data (
breed varchar(10),
id double,
age integer,
grade tinyint,
payment integer,
brand integer,
price double,
promotion double,
renew boolean,
inertia integer);

to import the csv file, I used 
`$ sqlite> .mode csv`
`$ sqlite> .import /path/to/csv data`

