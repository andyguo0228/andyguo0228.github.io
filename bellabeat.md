---
layout: post
title: Bellabeat Project
---

# Introduction

In this case study, I will be analyzing a public dataset using SQL for Bellabeat, a high-tech manufacturer of health-focused products for women. I'll be looking at smart device data to gain insight on how consumers use their smart devices and provide recommendations to the Bellabeat marketing strategy.

# Background

Bellabeat was founded in 2013 by Urška Sršen and Sando Mur with the goal of developing beautifully designed technology that would inform and inspire women. The technology would collect data on activity, sleep, stress, and reproductive health to empower women with knowledge about their own health.

Bellabeat products are available at a number of online retailers in addition to their website. The company has invested in traditional advertising media such as radio, billboards, print, and television, but focuses on digital marketing extensively. They have ads on Youtube and Google, and are active on multiple social media platforms including Facebook, Instagram, and Twitter.

**Bellabeat Products**
- Bellabeat app provides users with health data related to their activity, sleep, stress, menstrual cycle, and mindfulness habits. This data can help users better understand their current habits and make healthy decisions. The Bellabeat app connects to their line of smart wellness products.
- Leaf: A wellness tracker that can be worn as a bracelet, necklace, or clip and connects to the Bellabeat app to track activity, sleep, and stress.
- Time: A wellness watch with smart technology and connects to the Bellabeat app to track user activity, sleep, and stress.
- Spring: A water bottle with smart technology and connects to the Bellabeat app to track daily water intake.
- Bellabeat membership: A subscription-based membership program for users to have 24/7 access to fully personalized guidance on nutrition, activity, sleep, health and beauty, and mindfulness based on their lifestyle and goals.



### Business Task

Analyze smart device data to gain insight on how consumers use smart devices and answer the following questions:

- What are some trends in smart device usage?
- How could these trends apply to Bellabeat customers?
- How could these trends help influence Bellabeat marketing strategy?



### Prepare Data

The dataset was obtained from [Kaggle](https://www.kaggle.com/datasets/arashnic/fitbit) and contains FitBit tracker data from 30 users including minute, hourly, and daily level output data for activity intensity, steps, calories, sleep, and heart rate. The dataset contained 18 CSV files, each file containing a table varying in number of columns and content. Using Pandas and a Python loop, each file was read to a dataframe then written to a PostgreSQL database as a new table. 



```python
#Environment setup
import pandas as pd
import psycopg2
import sqlalchemy
%load_ext sql

#Connect to SQL database
connect_url = 'postgresql://{}:{}@{}:{}/{}'.format(user,password,host,port,db)
engine = sqlalchemy.create_engine(connect_url)
%sql $connect_url
%config SqlMagic.displaycon = False
```

    The sql extension is already loaded. To reload it, use:
      %reload_ext sql
    


```python
#Read multiple CSV files and load into SQL database
import glob 
import os
file_names = glob.glob('data/*.csv')

for names in file_names:
    tablename = os.path.basename(names)
    tablename, ext = os.path.splitext(tablename)
    df = pd.read_csv(names)
    df.columns = df.columns.str.lower() #convert column names to lower case
    df.to_sql(tablename, engine, if_exists='replace', index=False)
```


    ---------------------------------------------------------------------------

    PendingRollbackError                      Traceback (most recent call last)

    Cell In[4], line 11
          9 df = pd.read_csv(names)
         10 df.columns = df.columns.str.lower() #convert column names to lower case
    ---> 11 df.to_sql(tablename, engine, if_exists='replace', index=False)
    

    File c:\Users\Andy\AppData\Local\Programs\Python\Python311\Lib\site-packages\pandas\core\generic.py:2878, in NDFrame.to_sql(self, name, con, schema, if_exists, index, index_label, chunksize, dtype, method)
       2713 """
       2714 Write records stored in a DataFrame to a SQL database.
       2715 
       (...)
       2874 [(1,), (None,), (2,)]
       2875 """  # noqa:E501
       2876 from pandas.io import sql
    -> 2878 return sql.to_sql(
       2879     self,
       2880     name,
       2881     con,
       2882     schema=schema,
       2883     if_exists=if_exists,
       2884     index=index,
       2885     index_label=index_label,
       2886     chunksize=chunksize,
       2887     dtype=dtype,
       2888     method=method,
       2889 )
    

    File c:\Users\Andy\AppData\Local\Programs\Python\Python311\Lib\site-packages\pandas\io\sql.py:766, in to_sql(frame, name, con, schema, if_exists, index, index_label, chunksize, dtype, method, engine, **engine_kwargs)
        761 elif not isinstance(frame, DataFrame):
        762     raise NotImplementedError(
        763         "'frame' argument should be either a Series or a DataFrame"
        764     )
    --> 766 with pandasSQL_builder(con, schema=schema, need_transaction=True) as pandas_sql:
        767     return pandas_sql.to_sql(
        768         frame,
        769         name,
       (...)
        778         **engine_kwargs,
        779     )
    

    File c:\Users\Andy\AppData\Local\Programs\Python\Python311\Lib\site-packages\pandas\io\sql.py:1546, in SQLDatabase.__exit__(self, *args)
       1544 def __exit__(self, *args) -> None:
       1545     if not self.returns_generator:
    -> 1546         self.exit_stack.close()
    

    File c:\Users\Andy\AppData\Local\Programs\Python\Python311\Lib\contextlib.py:594, in ExitStack.close(self)
        592 def close(self):
        593     """Immediately unwind the context stack."""
    --> 594     self.__exit__(None, None, None)
    

    File c:\Users\Andy\AppData\Local\Programs\Python\Python311\Lib\contextlib.py:586, in ExitStack.__exit__(self, *exc_details)
        582 try:
        583     # bare "raise exc_details[1]" replaces our carefully
        584     # set-up context
        585     fixed_ctx = exc_details[1].__context__
    --> 586     raise exc_details[1]
        587 except BaseException:
        588     exc_details[1].__context__ = fixed_ctx
    

    File c:\Users\Andy\AppData\Local\Programs\Python\Python311\Lib\contextlib.py:571, in ExitStack.__exit__(self, *exc_details)
        569 assert is_sync
        570 try:
    --> 571     if cb(*exc_details):
        572         suppressed_exc = True
        573         pending_raise = False
    

    File c:\Users\Andy\AppData\Local\Programs\Python\Python311\Lib\site-packages\sqlalchemy\engine\util.py:146, in TransactionalContext.__exit__(self, type_, value, traceback)
        144     self.commit()
        145 except:
    --> 146     with util.safe_reraise():
        147         if self._rollback_can_be_called():
        148             self.rollback()
    

    File c:\Users\Andy\AppData\Local\Programs\Python\Python311\Lib\site-packages\sqlalchemy\util\langhelpers.py:147, in safe_reraise.__exit__(self, type_, value, traceback)
        145     assert exc_value is not None
        146     self._exc_info = None  # remove potential circular references
    --> 147     raise exc_value.with_traceback(exc_tb)
        148 else:
        149     self._exc_info = None  # remove potential circular references
    

    File c:\Users\Andy\AppData\Local\Programs\Python\Python311\Lib\site-packages\sqlalchemy\engine\util.py:144, in TransactionalContext.__exit__(self, type_, value, traceback)
        142 if type_ is None and self._transaction_is_active():
        143     try:
    --> 144         self.commit()
        145     except:
        146         with util.safe_reraise():
    

    File c:\Users\Andy\AppData\Local\Programs\Python\Python311\Lib\site-packages\sqlalchemy\engine\base.py:2615, in Transaction.commit(self)
       2599 """Commit this :class:`.Transaction`.
       2600 
       2601 The implementation of this may vary based on the type of transaction in
       (...)
       2612 
       2613 """
       2614 try:
    -> 2615     self._do_commit()
       2616 finally:
       2617     assert not self.is_active
    

    File c:\Users\Andy\AppData\Local\Programs\Python\Python311\Lib\site-packages\sqlalchemy\engine\base.py:2720, in RootTransaction._do_commit(self)
       2717 assert self.connection._transaction is self
       2719 try:
    -> 2720     self._connection_commit_impl()
       2721 finally:
       2722     # whether or not commit succeeds, cancel any
       2723     # nested transactions, make this transaction "inactive"
       2724     # and remove it as a reset agent
       2725     if self.connection._nested_transaction:
    

    File c:\Users\Andy\AppData\Local\Programs\Python\Python311\Lib\site-packages\sqlalchemy\engine\base.py:2691, in RootTransaction._connection_commit_impl(self)
       2690 def _connection_commit_impl(self) -> None:
    -> 2691     self.connection._commit_impl()
    

    File c:\Users\Andy\AppData\Local\Programs\Python\Python311\Lib\site-packages\sqlalchemy\engine\base.py:1135, in Connection._commit_impl(self)
       1133     self.engine.dialect.do_commit(self.connection)
       1134 except BaseException as e:
    -> 1135     self._handle_dbapi_exception(e, None, None, None, None)
    

    File c:\Users\Andy\AppData\Local\Programs\Python\Python311\Lib\site-packages\sqlalchemy\engine\base.py:2342, in Connection._handle_dbapi_exception(self, e, statement, parameters, cursor, context, is_sub_exec)
       2340     else:
       2341         assert exc_info[1] is not None
    -> 2342         raise exc_info[1].with_traceback(exc_info[2])
       2343 finally:
       2344     del self._reentrant_error
    

    File c:\Users\Andy\AppData\Local\Programs\Python\Python311\Lib\site-packages\sqlalchemy\engine\base.py:1133, in Connection._commit_impl(self)
       1131         self._log_info("COMMIT")
       1132 try:
    -> 1133     self.engine.dialect.do_commit(self.connection)
       1134 except BaseException as e:
       1135     self._handle_dbapi_exception(e, None, None, None, None)
    

    File c:\Users\Andy\AppData\Local\Programs\Python\Python311\Lib\site-packages\sqlalchemy\engine\base.py:573, in Connection.connection(self)
        571 if self._dbapi_connection is None:
        572     try:
    --> 573         return self._revalidate_connection()
        574     except (exc.PendingRollbackError, exc.ResourceClosedError):
        575         raise
    

    File c:\Users\Andy\AppData\Local\Programs\Python\Python311\Lib\site-packages\sqlalchemy\engine\base.py:665, in Connection._revalidate_connection(self)
        663 if self.__can_reconnect and self.invalidated:
        664     if self._transaction is not None:
    --> 665         self._invalid_transaction()
        666     self._dbapi_connection = self.engine.raw_connection()
        667     return self._dbapi_connection
    

    File c:\Users\Andy\AppData\Local\Programs\Python\Python311\Lib\site-packages\sqlalchemy\engine\base.py:655, in Connection._invalid_transaction(self)
        654 def _invalid_transaction(self) -> NoReturn:
    --> 655     raise exc.PendingRollbackError(
        656         "Can't reconnect until invalid %stransaction is rolled "
        657         "back.  Please rollback() fully before proceeding"
        658         % ("savepoint " if self._nested_transaction is not None else ""),
        659         code="8s2b",
        660     )
    

    PendingRollbackError: Can't reconnect until invalid transaction is rolled back.  Please rollback() fully before proceeding (Background on this error at: https://sqlalche.me/e/20/8s2b)



```sql
%%sql
-- Verify tables in database
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

    0 rows affected.
    




<table>
    <thead>
        <tr>
            <th>table_name</th>
        </tr>
    </thead>
    <tbody>
    </tbody>
</table>



### Process Data
I verified that a table was sucessfully created in the database with each CSV file. I found that there was a large number of tables to explore and wanted to simplify the dataset by eliminating tables with redundant information or combine those with similar content.

<p align="center">
    <img src='images\databasediagram.png' width=70%>
</p>

- The `dailycalories`, `dailyintensities`, and `dailysteps` tables where dropped as the data already existed in the `dailyactivity` table. 
- A new table with hourly data was created by joining the `hourlycalories`, `hourlyintensities`, and `hourlysteps` tables; the 3 tables were subsequently dropped.
- Tables containing minute data were dropped as the data is too granular to extract any meaningful insights. 

In summary, the following tables were dropped:
* `dailycalories`
* `dailyintensities`
* `dailysteps`
* `hourlycalories`
* `hourlyintensities`
* `hourlysteps`
* `minutecaloriesnarrow`
* `minutecalorieswide`
* `minuteintensitiesnarrow`
* `minuteintensitieswide`
* `minutemetsnarrow`
* `minutesleep`
* `minutestepsnarrow`
* `minutestepswide`
* `heartrate_seconds`
* `weightloginfo`




```sql
%%sql
-- Join hourly tables and create new table
CREATE TABLE hourlydata AS(
SELECT c.id,
       c.activityhour,
       c.calories,
       i.totalintensity,
       i.averageintensity,
       s.steptotal
FROM hourlycalories AS c
FULL OUTER JOIN hourlyintensities AS i
    ON c.id = i.id
    AND c.activityhour = i.activityhour
FULL OUTER JOIN hourlysteps AS s
    ON i.id = s.id
    AND i.activityhour = s.activityhour
);
```

     * postgresql://postgres:***@localhost:5432/bellabeat
    22099 rows affected.
    




    []




```sql
%%sql
-- Drop tables not used
DROP TABLE IF EXISTS dailycalories, dailyintensities, dailysteps, hourlycalories, hourlyintensities, hourlysteps, minutecaloriesnarrow, minutecalorieswide, minuteintensitiesnarrow, minuteintensitieswide, minutemetsnarrow, minutesleep, minutestepsnarrow, minutestepswide, heartrate_seconds, weightloginfo;
```

     * postgresql://postgres:***@localhost:5432/bellabeat
    Done.
    




    []




```sql
%%sql
-- Verify tables were dropped
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

     * postgresql://postgres:***@localhost:5432/bellabeat
    3 rows affected.
    




<table>
    <tr>
        <th>table_name</th>
    </tr>
    <tr>
        <td>dailyactivity</td>
    </tr>
    <tr>
        <td>sleepday</td>
    </tr>
    <tr>
        <td>hourlydata</td>
    </tr>
</table>



I proceeded to clean the data
- In `sleepday` table, the `sleepday` column was renamed to sleepdate to avoid confusion.
- In `sleepday` table, the `sleepdate` column was changed to a date data type.
- In `dailyactivity` table, the `activitydate` column was changed to a date data type.
- In `hourlydata` table, the `activityhour` column was changed to a timestamp data type.
- Tables were checked for duplicate rows
    - In `sleepday` table, 3 duplicate rows were found and deleted




```sql
%%sql
--Rename sleepday column
ALTER TABLE sleepday
RENAME COLUMN sleepday TO sleepdate;
--Change activitydate type to date
ALTER TABLE dailyactivity
ALTER COLUMN activitydate TYPE date USING activitydate::date;
--Change sleepdate type to date
ALTER TABLE sleepday
ALTER COLUMN sleepdate TYPE date USING sleepdate::date;
--Change activityhour type to timestamp
ALTER TABLE hourlydata
ALTER COLUMN activityhour TYPE timestamp USING activityhour::timestamp;
```

     * postgresql://postgres:***@localhost:5432/bellabeat
    Done.
    Done.
    Done.
    Done.
    




    []




```sql
%%sql
-- Review table columns and data types
SELECT c.table_name,
       c.column_name,
       c.data_type
FROM information_schema.columns c
JOIN information_schema.tables t
ON c.table_name = t.table_name
WHERE c.table_schema = 'public'
ORDER BY table_name, column_name;
```

     * postgresql://postgres:***@localhost:5432/bellabeat
    26 rows affected.
    


<table>
    <tr>
        <th>table_name</th>
        <th>column_name</th>
        <th>data_type</th>
    </tr>
    <tr>
        <td>dailyactivity</td>
        <td>activitydate</td>
        <td>date</td>
    </tr>
    <tr>
        <td>dailyactivity</td>
        <td>calories</td>
        <td>bigint</td>
    </tr>
    <tr>
        <td>dailyactivity</td>
        <td>fairlyactiveminutes</td>
        <td>bigint</td>
    </tr>
    <tr>
        <td>dailyactivity</td>
        <td>id</td>
        <td>bigint</td>
    </tr>
    <tr>
        <td>dailyactivity</td>
        <td>lightactivedistance</td>
        <td>double precision</td>
    </tr>
    <tr>
        <td>dailyactivity</td>
        <td>lightlyactiveminutes</td>
        <td>bigint</td>
    </tr>
    <tr>
        <td>dailyactivity</td>
        <td>loggedactivitiesdistance</td>
        <td>double precision</td>
    </tr>
    <tr>
        <td>dailyactivity</td>
        <td>moderatelyactivedistance</td>
        <td>double precision</td>
    </tr>
    <tr>
        <td>dailyactivity</td>
        <td>sedentaryactivedistance</td>
        <td>double precision</td>
    </tr>
    <tr>
        <td>dailyactivity</td>
        <td>sedentaryminutes</td>
        <td>bigint</td>
    </tr>
    <tr>
        <td>dailyactivity</td>
        <td>totaldistance</td>
        <td>double precision</td>
    </tr>
    <tr>
        <td>dailyactivity</td>
        <td>totalsteps</td>
        <td>bigint</td>
    </tr>
    <tr>
        <td>dailyactivity</td>
        <td>trackerdistance</td>
        <td>double precision</td>
    </tr>
    <tr>
        <td>dailyactivity</td>
        <td>veryactivedistance</td>
        <td>double precision</td>
    </tr>
    <tr>
        <td>dailyactivity</td>
        <td>veryactiveminutes</td>
        <td>bigint</td>
    </tr>
    <tr>
        <td>hourlydata</td>
        <td>activityhour</td>
        <td>timestamp without time zone</td>
    </tr>
    <tr>
        <td>hourlydata</td>
        <td>averageintensity</td>
        <td>double precision</td>
    </tr>
    <tr>
        <td>hourlydata</td>
        <td>calories</td>
        <td>bigint</td>
    </tr>
    <tr>
        <td>hourlydata</td>
        <td>id</td>
        <td>bigint</td>
    </tr>
    <tr>
        <td>hourlydata</td>
        <td>steptotal</td>
        <td>bigint</td>
    </tr>
    <tr>
        <td>hourlydata</td>
        <td>totalintensity</td>
        <td>bigint</td>
    </tr>
    <tr>
        <td>sleepday</td>
        <td>id</td>
        <td>bigint</td>
    </tr>
    <tr>
        <td>sleepday</td>
        <td>sleepdate</td>
        <td>date</td>
    </tr>
    <tr>
        <td>sleepday</td>
        <td>totalminutesasleep</td>
        <td>bigint</td>
    </tr>
    <tr>
        <td>sleepday</td>
        <td>totalsleeprecords</td>
        <td>bigint</td>
    </tr>
    <tr>
        <td>sleepday</td>
        <td>totaltimeinbed</td>
        <td>bigint</td>
    </tr>
</table>



```sql
%%sql
--Check for duplicates
SELECT id,
       sleepdate,
       COUNT(*)
FROM sleepday
GROUP BY id, sleepdate
ORDER BY COUNT(*) DESC;

SELECT id,
       activitydate,
       COUNT(*)
FROM dailyactivity
GROUP BY id, activitydate
ORDER BY COUNT(*) DESC;

SELECT id,
       activityhour,
       COUNT(*)
FROM hourlydata
GROUP BY id, activityhour
ORDER BY COUNT(*) DESC;

--Duplicate rows deleted
DELETE
FROM sleepday
WHERE ctid IN (SELECT ctid
               FROM (SELECT ctid,
                            ROW_NUMBER() OVER (PARTITION BY id, sleepday) AS rn
                     FROM sleepday) AS temptable
               WHERE rn > 1);
```

     * postgresql://postgres:***@localhost:5432/bellabeat
    410 rows affected.
    940 rows affected.
    22099 rows affected.
    3 rows affected.
    




    []




```sql
%%sql
--View dailyactivity table
SELECT *
FROM dailyactivity
LIMIT 5;
```

     * postgresql://postgres:***@localhost:5432/bellabeat
    5 rows affected.
    




<table>
    <tr>
        <th>id</th>
        <th>activitydate</th>
        <th>totalsteps</th>
        <th>totaldistance</th>
        <th>trackerdistance</th>
        <th>loggedactivitiesdistance</th>
        <th>veryactivedistance</th>
        <th>moderatelyactivedistance</th>
        <th>lightactivedistance</th>
        <th>sedentaryactivedistance</th>
        <th>veryactiveminutes</th>
        <th>fairlyactiveminutes</th>
        <th>lightlyactiveminutes</th>
        <th>sedentaryminutes</th>
        <th>calories</th>
    </tr>
    <tr>
        <td>1503960366</td>
        <td>2016-04-12</td>
        <td>13162</td>
        <td>8.5</td>
        <td>8.5</td>
        <td>0.0</td>
        <td>1.87999999523163</td>
        <td>0.550000011920929</td>
        <td>6.05999994277954</td>
        <td>0.0</td>
        <td>25</td>
        <td>13</td>
        <td>328</td>
        <td>728</td>
        <td>1985</td>
    </tr>
    <tr>
        <td>1503960366</td>
        <td>2016-04-13</td>
        <td>10735</td>
        <td>6.96999979019165</td>
        <td>6.96999979019165</td>
        <td>0.0</td>
        <td>1.57000005245209</td>
        <td>0.689999997615814</td>
        <td>4.71000003814697</td>
        <td>0.0</td>
        <td>21</td>
        <td>19</td>
        <td>217</td>
        <td>776</td>
        <td>1797</td>
    </tr>
    <tr>
        <td>1503960366</td>
        <td>2016-04-14</td>
        <td>10460</td>
        <td>6.73999977111816</td>
        <td>6.73999977111816</td>
        <td>0.0</td>
        <td>2.44000005722046</td>
        <td>0.400000005960464</td>
        <td>3.91000008583069</td>
        <td>0.0</td>
        <td>30</td>
        <td>11</td>
        <td>181</td>
        <td>1218</td>
        <td>1776</td>
    </tr>
    <tr>
        <td>1503960366</td>
        <td>2016-04-15</td>
        <td>9762</td>
        <td>6.28000020980835</td>
        <td>6.28000020980835</td>
        <td>0.0</td>
        <td>2.14000010490417</td>
        <td>1.25999999046326</td>
        <td>2.82999992370605</td>
        <td>0.0</td>
        <td>29</td>
        <td>34</td>
        <td>209</td>
        <td>726</td>
        <td>1745</td>
    </tr>
    <tr>
        <td>1503960366</td>
        <td>2016-04-16</td>
        <td>12669</td>
        <td>8.15999984741211</td>
        <td>8.15999984741211</td>
        <td>0.0</td>
        <td>2.71000003814697</td>
        <td>0.409999996423721</td>
        <td>5.03999996185303</td>
        <td>0.0</td>
        <td>36</td>
        <td>10</td>
        <td>221</td>
        <td>773</td>
        <td>1863</td>
    </tr>
</table>




```sql
%%sql
--View sleepday table
SELECT *
FROM sleepday
LIMIT 5;
```

     * postgresql://postgres:***@localhost:5432/bellabeat
    5 rows affected.
    




<table>
    <tr>
        <th>id</th>
        <th>sleepdate</th>
        <th>totalsleeprecords</th>
        <th>totalminutesasleep</th>
        <th>totaltimeinbed</th>
    </tr>
    <tr>
        <td>1503960366</td>
        <td>2016-04-12</td>
        <td>1</td>
        <td>327</td>
        <td>346</td>
    </tr>
    <tr>
        <td>1503960366</td>
        <td>2016-04-13</td>
        <td>2</td>
        <td>384</td>
        <td>407</td>
    </tr>
    <tr>
        <td>1503960366</td>
        <td>2016-04-15</td>
        <td>1</td>
        <td>412</td>
        <td>442</td>
    </tr>
    <tr>
        <td>1503960366</td>
        <td>2016-04-16</td>
        <td>2</td>
        <td>340</td>
        <td>367</td>
    </tr>
    <tr>
        <td>1503960366</td>
        <td>2016-04-17</td>
        <td>1</td>
        <td>700</td>
        <td>712</td>
    </tr>
</table>




```sql
%%sql
--View hourlydata table
SELECT *
FROM hourlydata
LIMIT 5;
```

     * postgresql://postgres:***@localhost:5432/bellabeat
    5 rows affected.
    




<table>
    <tr>
        <th>id</th>
        <th>activityhour</th>
        <th>calories</th>
        <th>totalintensity</th>
        <th>averageintensity</th>
        <th>steptotal</th>
    </tr>
    <tr>
        <td>1503960366</td>
        <td>2016-04-12 00:00:00</td>
        <td>81</td>
        <td>20</td>
        <td>0.333333</td>
        <td>373</td>
    </tr>
    <tr>
        <td>1503960366</td>
        <td>2016-04-12 01:00:00</td>
        <td>61</td>
        <td>8</td>
        <td>0.133333</td>
        <td>160</td>
    </tr>
    <tr>
        <td>1503960366</td>
        <td>2016-04-12 02:00:00</td>
        <td>59</td>
        <td>7</td>
        <td>0.116667</td>
        <td>151</td>
    </tr>
    <tr>
        <td>1503960366</td>
        <td>2016-04-12 03:00:00</td>
        <td>47</td>
        <td>0</td>
        <td>0.0</td>
        <td>0</td>
    </tr>
    <tr>
        <td>1503960366</td>
        <td>2016-04-12 04:00:00</td>
        <td>48</td>
        <td>0</td>
        <td>0.0</td>
        <td>0</td>
    </tr>
</table>



### Analyze Data

After cleaning the data, I connected the dataset to Tableau to build visualizations and extract insights. My Tableau workbook can be found here: <br>
[https://public.tableau.com/views/bellabeat_dashboard_16815197263150/Dashboard1?:language=en-US&:display_count=n&:origin=viz_share_link](https://public.tableau.com/views/bellabeat_dashboard_16815197263150/Dashboard1?:language=en-US&:display_count=n&:origin=viz_share_link)
<br>
<br>

<img src='images\userdays_bar.png' width=60%>

This bar chart illustrates the number of days each user tracked their activity. The majority of users tracked their activity for at least 30 days. Only a subset of 22 users tracked their sleep activity and only 13 users tracked their sleep for more than 15 days.

<br>
<br>

<img src='images\activity_pie.png' width=60%>
<img src='images\activity_scatter.png' width=60%>

On average, most users remained sedentary for 81% of the day. The scatterplot demonstrates a positive correlation between the number of steps taken and the number of calories burned. 

<br>
<br>

<img src='images\steps_calorie_line.png' width=60%>
<img src='images\heatmap.png' width=60%>

We found that users are most active between 5PM and 7PM, and least active between 12AM and 5AM. However, on Saturday, there is an increase in user activity between 11AM and 2PM.


### Share Results
- What are some trends in smart device usage?
    - Most users tracked their activity for at least 30 days, but only 13 users tracked their sleep for more than 15 days.
    - Users are most active between 5PM and 7PM, and least active between 12AM and 5AM. However, on Saturday, there is an increase in user activity between 11AM and 2PM.
    - On average, most users remained sedentary for 81% of the day. 
    - The scatterplot demonstrates a positive correlation between the number of steps taken and the number of calories burned.
- How could these trends apply to Bellabeat customers?
    - It seems that a majority of users are not using their smart devices to track their sleep. The device might not be comfortable to wear to bed, the device may need to be taken off to charge the battery, or the user may not be aware of the sleep tracking freature. Bellabeat could create a marketing campaign to educate users on the sleep tracking feature and encourage them to track their sleep.
    - We find that most users remain sedentary for most of the day. Bellabeat could create a marketing campaign to encourage users to be more active throughout the day with reminders to meet daily step goals. 

