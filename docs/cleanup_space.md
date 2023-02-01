# Steps to check the database size

### Open the console and in the terminal window for the DB pod type the below command:
- psql app
- execute the below SQL
```
SELECT schema_name, 
       sum(table_size),
	   pg_size_pretty(sum(table_size)) AS size,
       (sum(table_size) / database_size) * 100
FROM (
  SELECT pg_catalog.pg_namespace.nspname as schema_name,
         pg_relation_size(pg_catalog.pg_class.oid) as table_size,
         sum(pg_relation_size(pg_catalog.pg_class.oid)) over () as database_size
  FROM   pg_catalog.pg_class
     JOIN pg_catalog.pg_namespace ON relnamespace = pg_catalog.pg_namespace.oid
) t
GROUP BY schema_name, database_size;
```


# ![image](https://user-images.githubusercontent.com/90332175/215883505-a6c0890e-dad9-4c2b-9e3e-5fd661e903ea.png)


# Steps to check the size of each table within a schema

### Open the console and in the terminal window for the DB pod type the below command:
- psql app
- set schema 'scema-name';
- \dt (to get a list of tables)

# ![image](https://user-images.githubusercontent.com/90332175/215885264-cf89c30e-7409-477d-aa45-322eb7f8dec8.png)

- execute the below SQL
```
SELECT
  schema_name,
  relname,
  pg_size_pretty(table_size) AS size,
  table_size
FROM (
  SELECT
  pg_catalog.pg_namespace.nspname AS schema_name,
  relname,
  pg_relation_size(pg_catalog.pg_class.oid) AS table_size
  FROM pg_catalog.pg_class
  JOIN pg_catalog.pg_namespace ON relnamespace = pg_catalog.pg_namespace.oid
  ) t
WHERE schema_name NOT LIKE 'pg_%'
ORDER BY table_size DESC;
```
# ![image](https://user-images.githubusercontent.com/90332175/215885708-4580f3f7-0ac6-4220-a70c-7745c2bdaf25.png)


# Steps to delete data from a table

### Open the console and in the terminal window for the DB pod type the below command:
- psql app
- set schema 'scema-name';
- \dt (to get a list of tables)
- truncate table_name cascade;

# ![image](https://user-images.githubusercontent.com/90332175/215888018-7313241f-2ed2-41f7-9499-545fde9bb81f.png)

