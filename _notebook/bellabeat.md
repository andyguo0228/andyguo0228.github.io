---
layout: notebook
title: Bellabeat Fitness Tracker Project 🏃‍♂️
---
This is the capestone project for the Google data analytics certificate. I'll be conducting an in-depth case study on Bellabeat, a high-tech manufacturer of health-focused products for women. My focus will be on analyzing smart device data to gain valuable insights into consumer usage patterns, which will enable me to provide data-driven recommendations for optimizing Bellabeat's marketing strategy. I deployed an AWS database, used Python to connect and import the data, SQL to clean and process the data, and Tableau to visualize the data. 

Although I will be using Python to prepare the data, my aim is to demonstrate my proficiency in utilizing SQL and Tableau.

# Background
Bellabeat was founded in 2013 by Urška Sršen and Sando Mur with the goal of developing beautifully designed technology that would inform and inspire women. The technology would collect data on activity, sleep, stress, and reproductive health to empower women with knowledge about their own health.

Bellabeat products are available at several retailers in addition to their website. The company has invested in traditional advertising media such as radio, billboards, print, and television, but focuses on digital marketing extensively. They have ads on Youtube and Google, and are active on multiple social media platforms including Facebook, Instagram, and Twitter.

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

The dataset was obtained from [Kaggle](https://www.kaggle.com/datasets/arashnic/fitbit) and contained FitBit tracker data from 33 users. There were 18 CSV files, each file containing a table varying in number of columns and content. I created a data dictionary to help me understand the data and determine which tables to use for my analysis. 

```python
#Setup Environment
import pandas as pd
import psycopg2
import sqlalchemy
import csv
import os
from IPython.display import display, HTML
%load_ext sql

#Connect to SQL database
connect_url = 'postgresql://{}:{}@{}:{}/{}'.format(user,password,host,port,db)
engine = sqlalchemy.create_engine(connect_url)
%sql $connect_url
%config SqlMagic.displaycon = False
```

```python
#Create data dictionary
csv_directory = 'data/'
data_dict = {}
for filename in os.listdir(csv_directory):
    if filename.endswith('.csv'):
        with open(os.path.join(csv_directory, filename), mode='r') as csv_file:
            csv_reader = csv.reader(csv_file)
            column_names = next(csv_reader)
            data_dict[filename] = column_names

#Print data dictionary          
for key, values in data_dict.items():
    formatted_values = ", ".join(map(str, values))
    formatted_output = "<span style='color: lightseagreen'>{}</span>: {}".format(key, formatted_values)
    display(HTML(formatted_output))
```

<span style='color: lightseagreen'>dailyactivity.csv</span>: Id, ActivityDate, TotalSteps, TotalDistance, TrackerDistance, LoggedActivitiesDistance, VeryActiveDistance, ModeratelyActiveDistance, LightActiveDistance, SedentaryActiveDistance, VeryActiveMinutes, FairlyActiveMinutes, LightlyActiveMinutes, SedentaryMinutes, Calories

<span style='color: lightseagreen'>dailycalories.csv</span>: Id, ActivityDay, Calories

<span style='color: lightseagreen'>dailyintensities.csv</span>: Id, ActivityDay, SedentaryMinutes, LightlyActiveMinutes, FairlyActiveMinutes, VeryActiveMinutes, SedentaryActiveDistance, LightActiveDistance, ModeratelyActiveDistance, VeryActiveDistance

<span style='color: lightseagreen'>dailysteps.csv</span>: Id, ActivityDay, StepTotal

<span style='color: lightseagreen'>heartrate_seconds.csv</span>: Id, Time, Value

<span style='color: lightseagreen'>hourlycalories.csv</span>: Id, ActivityHour, Calories

<span style='color: lightseagreen'>hourlyintensities.csv</span>: Id, ActivityHour, TotalIntensity, AverageIntensity

<span style='color: lightseagreen'>hourlysteps.csv</span>: Id, ActivityHour, StepTotal

<span style='color: lightseagreen'>minutecaloriesnarrow.csv</span>: Id, ActivityMinute, Calories

<span style='color: lightseagreen'>minutecalorieswide.csv</span>: Id, ActivityHour, Calories00, Calories01, Calories02, Calories03, Calories04, Calories05, Calories06, Calories07, Calories08, Calories09, Calories10, Calories11, Calories12, Calories13, Calories14, Calories15, Calories16, Calories17, Calories18, Calories19, Calories20, Calories21, Calories22, Calories23, Calories24, Calories25, Calories26, Calories27, Calories28, Calories29, Calories30, Calories31, Calories32, Calories33, Calories34, Calories35, Calories36, Calories37, Calories38, Calories39, Calories40, Calories41, Calories42, Calories43, Calories44, Calories45, Calories46, Calories47, Calories48, Calories49, Calories50, Calories51, Calories52, Calories53, Calories54, Calories55, Calories56, Calories57, Calories58, Calories59

<span style='color: lightseagreen'>minuteintensitiesnarrow.csv</span>: Id, ActivityMinute, Intensity

<span style='color: lightseagreen'>minuteintensitieswide.csv</span>: Id, ActivityHour, Intensity00, Intensity01, Intensity02, Intensity03, Intensity04, Intensity05, Intensity06, Intensity07, Intensity08, Intensity09, Intensity10, Intensity11, Intensity12, Intensity13, Intensity14, Intensity15, Intensity16, Intensity17, Intensity18, Intensity19, Intensity20, Intensity21, Intensity22, Intensity23, Intensity24, Intensity25, Intensity26, Intensity27, Intensity28, Intensity29, Intensity30, Intensity31, Intensity32, Intensity33, Intensity34, Intensity35, Intensity36, Intensity37, Intensity38, Intensity39, Intensity40, Intensity41, Intensity42, Intensity43, Intensity44, Intensity45, Intensity46, Intensity47, Intensity48, Intensity49, Intensity50, Intensity51, Intensity52, Intensity53, Intensity54, Intensity55, Intensity56, Intensity57, Intensity58, Intensity59

<span style='color: lightseagreen'>minutemetsnarrow.csv</span>: Id, ActivityMinute, METs

<span style='color: lightseagreen'>minutesleep.csv</span>: Id, date, value, logId

<span style='color: lightseagreen'>minutestepsnarrow.csv</span>: Id, ActivityMinute, Steps

<span style='color: lightseagreen'>minutestepswide.csv</span>: Id, ActivityHour, Steps00, Steps01, Steps02, Steps03, Steps04, Steps05, Steps06, Steps07, Steps08, Steps09, Steps10, Steps11, Steps12, Steps13, Steps14, Steps15, Steps16, Steps17, Steps18, Steps19, Steps20, Steps21, Steps22, Steps23, Steps24, Steps25, Steps26, Steps27, Steps28, Steps29, Steps30, Steps31, Steps32, Steps33, Steps34, Steps35, Steps36, Steps37, Steps38, Steps39, Steps40, Steps41, Steps42, Steps43, Steps44, Steps45, Steps46, Steps47, Steps48, Steps49, Steps50, Steps51, Steps52, Steps53, Steps54, Steps55, Steps56, Steps57, Steps58, Steps59

<span style='color: lightseagreen'>sleepday.csv</span>: Id, SleepDay, TotalSleepRecords, TotalMinutesAsleep, TotalTimeInBed

<span style='color: lightseagreen'>weightloginfo.csv</span>: Id, Date, WeightKg, WeightPounds, Fat, BMI, IsManualReport, LogId

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

### Process Data
I verified that each CSV file was successfully imported into my PostgreSQL database. I found that there was a large number of tables and wanted to simplify the dataset by eliminating tables with redundant information or combine those with similar content.

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

The following tables remained in the database:
* `dailyactivity`
* `hourlydata`
* `sleepday`

```python
%%sql
-- Verify tables in database
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

    18 rows affected.



<table>
    <thead>
        <tr>
            <th>table_name</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>minutecalorieswide</td>
        </tr>
        <tr>
            <td>minuteintensitiesnarrow</td>
        </tr>
        <tr>
            <td>minuteintensitieswide</td>
        </tr>
        <tr>
            <td>minutemetsnarrow</td>
        </tr>
        <tr>
            <td>minutesleep</td>
        </tr>
        <tr>
            <td>minutestepsnarrow</td>
        </tr>
        <tr>
            <td>minutestepswide</td>
        </tr>
        <tr>
            <td>sleepday</td>
        </tr>
        <tr>
            <td>weightloginfo</td>
        </tr>
        <tr>
            <td>dailyactivity</td>
        </tr>
        <tr>
            <td>dailycalories</td>
        </tr>
        <tr>
            <td>dailyintensities</td>
        </tr>
        <tr>
            <td>dailysteps</td>
        </tr>
        <tr>
            <td>heartrate_seconds</td>
        </tr>
        <tr>
            <td>hourlycalories</td>
        </tr>
        <tr>
            <td>hourlyintensities</td>
        </tr>
        <tr>
            <td>hourlysteps</td>
        </tr>
        <tr>
            <td>minutecaloriesnarrow</td>
        </tr>
    </tbody>
</table>


```python
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

```python
%%sql
--Verify new table
SELECT *
FROM hourlydata
LIMIT 10;
```

    10 rows affected.



<table>
    <thead>
        <tr>
            <th>id</th>
            <th>activityhour</th>
            <th>calories</th>
            <th>totalintensity</th>
            <th>averageintensity</th>
            <th>steptotal</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1503960366</td>
            <td>4/12/2016 12:00:00 AM</td>
            <td>81</td>
            <td>20</td>
            <td>0.333333</td>
            <td>373</td>
        </tr>
        <tr>
            <td>1503960366</td>
            <td>4/12/2016 1:00:00 AM</td>
            <td>61</td>
            <td>8</td>
            <td>0.133333</td>
            <td>160</td>
        </tr>
        <tr>
            <td>1503960366</td>
            <td>4/12/2016 2:00:00 AM</td>
            <td>59</td>
            <td>7</td>
            <td>0.116667</td>
            <td>151</td>
        </tr>
        <tr>
            <td>1503960366</td>
            <td>4/12/2016 3:00:00 AM</td>
            <td>47</td>
            <td>0</td>
            <td>0.0</td>
            <td>0</td>
        </tr>
        <tr>
            <td>1503960366</td>
            <td>4/12/2016 4:00:00 AM</td>
            <td>48</td>
            <td>0</td>
            <td>0.0</td>
            <td>0</td>
        </tr>
        <tr>
            <td>1503960366</td>
            <td>4/12/2016 5:00:00 AM</td>
            <td>48</td>
            <td>0</td>
            <td>0.0</td>
            <td>0</td>
        </tr>
        <tr>
            <td>1503960366</td>
            <td>4/12/2016 6:00:00 AM</td>
            <td>48</td>
            <td>0</td>
            <td>0.0</td>
            <td>0</td>
        </tr>
        <tr>
            <td>1503960366</td>
            <td>4/12/2016 7:00:00 AM</td>
            <td>47</td>
            <td>0</td>
            <td>0.0</td>
            <td>0</td>
        </tr>
        <tr>
            <td>1503960366</td>
            <td>4/12/2016 8:00:00 AM</td>
            <td>68</td>
            <td>13</td>
            <td>0.216667</td>
            <td>250</td>
        </tr>
        <tr>
            <td>1503960366</td>
            <td>4/12/2016 9:00:00 AM</td>
            <td>141</td>
            <td>30</td>
            <td>0.5</td>
            <td>1864</td>
        </tr>
    </tbody>
</table>


```python
%%sql
-- Drop tables not used
DROP TABLE IF EXISTS dailycalories, dailyintensities, dailysteps, hourlycalories, hourlyintensities, hourlysteps, minutecaloriesnarrow, minutecalorieswide, minuteintensitiesnarrow, minuteintensitieswide, minutemetsnarrow, minutesleep, minutestepsnarrow, minutestepswide, heartrate_seconds, weightloginfo;

-- Verify tables in database
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

    Done.
    3 rows affected.



<table>
    <thead>
        <tr>
            <th>table_name</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>sleepday</td>
        </tr>
        <tr>
            <td>dailyactivity</td>
        </tr>
        <tr>
            <td>hourlydata</td>
        </tr>
    </tbody>
</table>


### Clean Data

3 Tables remained in the database: `dailyactivity`, `hourlydata`, and `sleepday`. After reviewing each table, including the column names and data types, I proceeded to check for any duplicates or null values.

- In `sleepday` table, the `sleepday` column was renamed to sleepdate to avoid confusion.
- In `sleepday` table, the `sleepdate` column was changed to a date data type.
- In `dailyactivity` table, the `activitydate` column was changed to a date data type.
- In `hourlydata` table, the `activityhour` column was changed to a timestamp data type.
- Tables were checked for duplicate rows
    - In `sleepday` table, 3 duplicate rows were found and deleted



```python
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

    26 rows affected.



<table>
    <thead>
        <tr>
            <th>table_name</th>
            <th>column_name</th>
            <th>data_type</th>
        </tr>
    </thead>
    <tbody>
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
    </tbody>
</table>


```python
%%sql
SELECT *
FROM sleepday
LIMIT 10;
```

    10 rows affected.



<table>
    <thead>
        <tr>
            <th>id</th>
            <th>sleepdate</th>
            <th>totalsleeprecords</th>
            <th>totalminutesasleep</th>
            <th>totaltimeinbed</th>
        </tr>
    </thead>
    <tbody>
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
        <tr>
            <td>1503960366</td>
            <td>2016-04-19</td>
            <td>1</td>
            <td>304</td>
            <td>320</td>
        </tr>
        <tr>
            <td>1503960366</td>
            <td>2016-04-20</td>
            <td>1</td>
            <td>360</td>
            <td>377</td>
        </tr>
        <tr>
            <td>1503960366</td>
            <td>2016-04-21</td>
            <td>1</td>
            <td>325</td>
            <td>364</td>
        </tr>
        <tr>
            <td>1503960366</td>
            <td>2016-04-23</td>
            <td>1</td>
            <td>361</td>
            <td>384</td>
        </tr>
        <tr>
            <td>1503960366</td>
            <td>2016-04-24</td>
            <td>1</td>
            <td>430</td>
            <td>449</td>
        </tr>
    </tbody>
</table>


```python
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

```python
%%sql
--Check for null values in tables
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'dailyactivity' 
AND table_schema = 'public' 
AND is_nullable = 'YES' 
AND EXISTS (
    SELECT 1 FROM dailyactivity WHERE column_name IS NULL);

SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'sleepday' 
AND table_schema = 'public' 
AND is_nullable = 'YES' 
AND EXISTS (
    SELECT 1 FROM sleepday WHERE column_name IS NULL);

SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'hourlydata' 
AND table_schema = 'public' 
AND is_nullable = 'YES' 
AND EXISTS (
    SELECT 1 FROM hourlydata WHERE column_name IS NULL);
```

```python
%%sql
--Check for duplicates
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

SELECT id,
       sleepdate,
       COUNT(*)
FROM sleepday
GROUP BY id, sleepdate
ORDER BY COUNT(*) DESC
LIMIT 5;
```

    940 rows affected.
    22099 rows affected.
    5 rows affected.



<table>
    <thead>
        <tr>
            <th>id</th>
            <th>sleepdate</th>
            <th>count</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>4388161847</td>
            <td>2016-05-05</td>
            <td>2</td>
        </tr>
        <tr>
            <td>8378563200</td>
            <td>2016-04-25</td>
            <td>2</td>
        </tr>
        <tr>
            <td>4702921684</td>
            <td>2016-05-07</td>
            <td>2</td>
        </tr>
        <tr>
            <td>7086361926</td>
            <td>2016-05-01</td>
            <td>1</td>
        </tr>
        <tr>
            <td>6962181067</td>
            <td>2016-05-05</td>
            <td>1</td>
        </tr>
    </tbody>
</table>


```python
%%sql
--Drop duplicates
DELETE
FROM sleepday
WHERE ctid IN (SELECT ctid
               FROM (SELECT ctid,
                            ROW_NUMBER() OVER (PARTITION BY id, sleepday) AS rn
                     FROM sleepday) AS temptable
               WHERE rn > 1);
```

### Analyze Data

After cleaning the data, I connected the dataset to Tableau to build visualizations and extract insights. My Tableau workbook can be found here: <br>
[https://public.tableau.com/views/bellabeat_dashboard_16815197263150/Dashboard1?:language=en-US&:display_count=n&:origin=viz_share_link](https://public.tableau.com/views/bellabeat_dashboard_16815197263150/Dashboard1?:language=en-US&:display_count=n&:origin=viz_share_link)
<br>

<div class="image-container">
  <img src="./images/bellabeat/userdays_bar.png" class="small-image" onclick="enlargeImage(this)">
</div>    

This bar chart illustrates the number of days each user tracked their activity. The majority of users tracked their activity for at least 30 days. Only a subset of 22 users tracked their sleep activity and only 13 users tracked their sleep for more than 15 days.

<div class="image-container">
  <img src="./images/bellabeat/activity_pie.png" class="small-image" onclick="enlargeImage(this)">
</div>    
<div class="image-container">
  <img src="./images/bellabeat/activity_scatter.png" class="small-image" onclick="enlargeImage(this)">
</div>    

On average, most users remained sedentary for 81% of the day. The scatterplot demonstrates a positive correlation between the number of steps taken and the number of calories burned. 

<div class="image-container">
  <img src="./images/bellabeat/steps_calorie_line.png" class="small-image" onclick="enlargeImage(this)">
</div>    
<div class="image-container">
  <img src="./images/bellabeat/heatmap.png" class="small-image" onclick="enlargeImage(this)">
</div>    

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

