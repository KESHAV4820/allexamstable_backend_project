'use strict';

//👇🏼this is to increase the heap size of node.js
// const v8 = require('v8');
// v8.setFlagsFromString('--max_old_space_size=16384');Usless Coding it failed to work
//ConceptKnowledge GapRemember It: typeof(someArray) give output that someArray is an Note: "OBJECT". this is misleading. to confirm if a variable named "someArray" is an array actually, we need to use Array.isArray(someArray) 
/*SuperVIENoteRemember It: nodemon will crash saying node ran out of heap memory. to avoid such case, you need to run you backend without using nodemon using the command 
👉🏼VIE "node --max-old-space-size=16384 app.js". Becouse, nodemon isn't using the allocated heap size assigned to node environment variables using the code in cmd👈🏼⚡⚡
LearnByHeartJust Beautiful⚡⚡you can also use ➡️node --prof --max-old-space-size=16384 app.js this will create the log file which starts with 'isolate-' <filename> ends with '-v8.log', use the command to covert the file into text to see the log of which function is eating more memory ➡️node --prof-process isolate-<filenamelikesomelongnumber>-v8.log > processed_or_anynameyoulike.txt⚡⚡
👉🏼 setx NODE_OPTIONS --max-old-space-size=12288 and then to check if the assignment has been done, restart your system and then go to cmd and enter 
👉🏼 echo %NODE_OPTIONS%
👉🏼VIE➡️ even this command can also be used "nodemon --exec 'node --max-old-space-size=16384' app.js". using this, the nodemon runs the app without crashing.👈🏼⚡⚡ 

⚡➡️Super👉🏼 we are using new process manager for hosting server named "pm2". Actually, this is the mostly used tool in the industry and it has very rich tools into it which nodemon can't even match. But, Ofcourse, this has a bit of learning curve. Not very big curve, but just a bit of learning curve. So following are the commands that needs to be use to run the same app with pm2 process manager. 👉🏼⚡VIEfirst write this in package.json in script for "start:dev":"pm2 start app.js --node-args=\"--max-old-space-size=16384\" --watch --no-daemon", 
    ⚡➡️ to start server using pm2:- pm2 start app.js
    ⚡➡️ to stop the server in pm2:- pm2 stop app
    ⚡➡️ to see the logs in pm2:- pm2 logs
    ⚡➡️ to view list of process running:- pm2 list
    ⚡➡️ to monitor your application: pm2 monit
    Remember you don't need these command

just to remember this script from package.js becouse i can't comment in .json file hence i am writting it in here.😊. It's meant to remember what was there before switching from "nodemon" to "pm2".
"scripts": {
    "start:dev": "NODE_ENV=development nodemon --max-old-space-size=16384 app.js",
    "start:prod": "NODE_ENV=production nodemon --max-old-space-size=16384 app.js"
  }, and this has been replaced by pm2 commands in script. and nodemon isn't using "ecosystem.config.js". This file has been introduced when we were switching to pm2 from nodemon. becouse i wanted to use standered way to run the program instead of special commands like i mentioned above. after this file, now i can use➡️ npm run start:dev, or➡️ npm run start:prod. or ➡️npm run stop to stop the server all together. Note➡️ ctrl+c will stop just the current process going on in the pm2. not the whole server. 
*/

/* SuperNote
1. in this folder, first we setup the server in app.
2. it's here that we add Routes / (path) on the CRUD functions of node.js to the server variable named app in this file. 
3. we also add the middleware functions to the server variable named app in this file.
4. we can name a path anything. It just that when our browser that is frontend, on the some evenlistening sends this value to the server in the addressbar, our server get's a clue to send what kind of content. 
5. But it's better to have a structured naming system. Becouse the system that we make has to scalable and maintainable by anyone in comming years. hence there has to be a logic behind performing 
6. never forget to use try catch within these backend functions, becouse they use asyn, and hence uses promise. And in these case, automatic throw of error fails. Hence you need to do it explicitly. 
7.Remember It I didn't knew where to write this important thing. Hence i am writing it here. When database is very big, like crores of data. Your querying will be very slow. Hence, you will need to optimise your database. process of optimization has many steps in it. i am writing them as you will need to do starting from first, being the first step to optimise your database and so on. 1️⃣"partition" the database(on the fields that can break the table into major chunks) 👉2️⃣"indexing" the database(single filed and multiple field basis as well. index those fields with less number of null value in them) 👉3️⃣"enable parallel querying process"(that is you will set the number of "workers" doing query from the database; simultaneously; for your query. The number of workers that your computer can afford exactly depends on the number of cores in your computer. At max, you can you number of worker= number of cores in your sytem - 1) 👉4️⃣"create materialised view" of queries that you deem important or most used ones or the most time taking ones. 👉5️⃣Keep "Refreshing the materialised view" so that if any change has been made in database, it get recorded by materialised view as well 👉6️⃣to keep materialised view update automatically, we need to "SCHEDULE the Refreshing of materialised view" 👉7️⃣to avoid stale data in materialised view, you need "Real-time Refreshing" of materialised view as well.

8. Remember ItLearnByHeartbattle tested solution: How to create database dump and how to import it. 
👉1️⃣ nagivate to the bin folder of the postgresql program files in the C drive. 
👉2️⃣ to dump an entire database(more useful choice): pg_dump -U username -d databasename > "C:\Program Files\PostgreSQL\[version]\bin\dumpfile.sql"
here username in ourcase was postgres and name of database was sscdatabase. 
e.g:- pg_dump -U postgres -d sscdatabase > "C:\Program Files\PostgreSQL\15\bin\allexamstable_partitioned.sql"
    🚓🚓🚨 this address above "C:\Program Files\PostgreSQL\15\bin\allexamstable_partitioned.sql" is the place where the dump so created will be saved. which as of now is within database dump file. which is not a good practise and in some computers in may deny the permission to wite into program files folder. Hence, you can give any addess, where you want this dump to be created. like "H:\sscdatabase.sql". also you give the database name to the database dump. why give table name to database dump. it will create confusion. Knowledge Gap newly added 26/05/2025
👉2️⃣to dump a table of a database: pg_dump -U postgres -d sscdatabase -t allexamstable_partitioned > "C:\Program Files\PostgreSQL\15\bin\allexamstable_partitioned.sql"
👉3️⃣ in each case, after entering this command you will be prompted to enter the password of the database and mindyou, while entering the password of the database, you won't see the keystrokes. It's for security reasons.
👉4️⃣why you create database dump of a database and sometime only for the table. Becouse sometimes, we just have a table that is small and we don't need to optimise it. So no partitioning or indexing. that table is standalone thing and hence, we need only one thing which is that table. But if you table is huge, contains 50 to 60 millions of records/rows and you need to optimise it to speedup the query. So you will need to partition and index the table. that will create additional separate table and indexes from the big table and the whole partitioned table and the big table is a connected system. So you no more has one table that you need to dump. Hence, you will need to dump the whole database like sscdatabase in our case.
👉5️⃣ the database dump so created will have .sql extension, may look like notepad icon or database icon. you will find it inside the bin file only. 
 
9.Remember ItLearnByHeartbattle tested solution: steps to import the database dump into another system. 
 👉1️⃣ first, navigate to the bin folder of postgres in the terminal or cmd using cd command. like: cd "C:\Program Files\PostgreSQL\15\bin" 
 👉2️⃣then create the database possibly named the same as in the previous system using the command "createdb -U username databasename".  like this: "createdb -U postgres sscdatabase". you will need to enter the password of the database according to the password set in the new system when postgres was installed. 
 👉3️⃣ then import the database with command: psql -U username -d databasename -f "C:\path\to\your\dumpfile.sql" which in ourcase looks like: psql -U postgres -d sscdatabase -f "C:\Users\YourUsername\Desktop\allexamstable_partitioned.sql".
       🚓🚨Note that psql -U 👈🏼 this U has to be captial. "u" will work with pg_dump. but for "psql", you will have to have it in capital. or there will be error like psql: illegal option -- u 
 4️⃣ then you will need to change the password for the postgres database access previously mentioned in you program config or .env file in the backend section or frontend if needed.
 10. ConceptRemember It on Database
      When dealing with a partitioned table (allexamstable_partitioned) derived from a source table (allexamstable), you should:

      First insert the new data (new exam data) into your source table allexamstable
      Then modify your partitioning scheme to include the new dataset or new exam data in table allexamstable_partitioned

      Here's why this approach is recommended:

      The source table (allexamstable) should maintain all your raw data
      The partitioned table (allexamstable_partitioned) is essentially a organized view/structure of your source data
      This maintains data consistency and makes it easier to rebuild partitions if needed.

 11. Remember It: steps to partion and index your database.
 👉1️⃣ first, know the filed on the basis of which you would like to partition your database. i wanted to do it on the basis of exam names. So i found out the total number of distinct examnames and used those in the 👉🏼command:- on the basis of field "EXAMNAME"
  ⚡⚡⚡command for batch processing to partition: 
 DO $$ 
  DECLARE 
    exam_names TEXT[] := ARRAY[
        'AWO/TPO-2022', 'CAPF-2016', 'CAPF-2017', 'CAPF-2018', 'CAPF-2019', 'CAPF-2020', 'CAPF-2022', 'CAPF-2023',
        'CGL-2016', 'CGL-2017', 'CGL-2018', 'CGL-2019', 'CGL-2020', 'CGL-2021', 'CGL-2022', 'CGL-2023',
        'CHSL-2017', 'CHSL-2018', 'CHSL-2019', 'CHSL-2020', 'CHSL-2021', 'CHSL-2022', 'CHSL-2023',
        'CONSTABLE-2018', 'CONSTABLE-2021', 'CONSTABLE-2022', 'DPCST-2016', 'DPCST-2020', 'DPCST-2023',
        'DPDVR-2022', 'HC(MIN)IN DP-2022', 'IMD-2017', 'JE-2016', 'JE-2017', 'JE-2018', 'JE-2019', 'JE-2020', 
        'JE-2022', 'JE-2023', 'JHT-2016', 'JHT-2017', 'JHT-2018', 'JHT-2019', 'JHT-2020', 'JHT-2022', 'JHT-2023',
        'LDC-D-2017', 'LDC-D-2018', 'MTS-2016', 'MTS-2019', 'MTS-2020', 'MTS-2021', 'MTS-2022', 'MTS-2023',
        'SA_IMD-2022', 'STENO-2016', 'STENO-2017', 'STENO-2018', 'STENO-2019', 'STENO-2020', 'STENO-2022', 
        'STENO-2023', 'STENO-D-2017', 'UDC-D-2017'
    ];
    exam_name TEXT;
  BEGIN
    FOREACH exam_name IN ARRAY exam_names
    LOOP
        partition_name := replace(replace(replace(replace(exam_name, '(', '_'), ')', '_'), ' ', '_'), '/', '_');
        EXECUTE format(
            'CREATE TABLE IF NOT EXISTS public.%I PARTITION OF public.allexamstable_partitioned FOR VALUES IN (%L);',
            partition_name,
            exam_name
        );
    END LOOP;
  END $$;
NoteSuper: this line "replace(replace(exam_name, '-', '_'), '/', '_'), exam_name)" may need changes to handle the new Exam names that comes or patitioning based on other parameters. becouse exam name may have special character which postgres reserves for it's own use. Or you can use it more beautifully like 
          -- Replace hyphens and slashes with underscores for table names
		-- Properly replace invalid characters for PostgreSQL table names
        partition_name := exam_name;
        -- partition_name := replace(partition_name, '-', '_');
        partition_name := replace(partition_name, '/', '_');
        partition_name := replace(partition_name, ' ', '_');
        partition_name := replace(partition_name, '(', '_');
        partition_name := replace(partition_name, ')', '_');

  ⚡⚡⚡Command for individual examnames to partition them:
      1. Create the specific partition for that particular exam data based on the field being used to partition. eg:- "Constable-2015".
          DO $$
              DECLARE
                  exam_name TEXT := 'constable-2015';
                  partition_name TEXT;
              BEGIN
                  partition_name := replace(replace(replace(replace(exam_name, '(', '_'), ')', '_'), ' ', '_'), '/', '_');
                  EXECUTE format(
                      'CREATE TABLE IF NOT EXISTS public.%I PARTITION OF public.allexamstable_partitioned FOR VALUES IN (%L);',
                      partition_name,
                      exam_name
                  );
          END $$;

      2. Insert the data.
          \COPY allexamstable_partitioned FROM 'C:\Users\HP\Desktop\allexamstableoutput\C2015.csv' WITH (FORMAT csv, HEADER); This command will be executable in psql interface of Admin 4 tool.
  
// you may use this line as well:- " replace(replace(replace(replace(exam_name, '(', '_'), ')', '_'), ' ', '_'), '/', '_');"
  ⚡⚡⚡Remember It LearnByHeart battle tested solution23/04/2025: If you want PostgreSQL to automatically partition new exams when they arrive, you can modify your partitioning script to fetch missing partitions dynamically.👇🏼

  step 1: import the data into the allexamstable table. This is the main table where all the data will be imported as backup. You can use the command: \COPY allexamstable FROM 'C:\Users\HP\Desktop\allexamstableoutput\C2015.csv' WITH (FORMAT csv, HEADER); This command will be executable in psql interface of Admin 4 tool. It will not throw partition don't exist error becouse the table is not partitioned yet. It will just import the data into the allexamstable table. OR you can use the import data option from admin4 tool.

  step 2: generate the partition dynamically based on the distict examname output for which partition hasn't been made in partition table. This is done by getting the list of examnames from the EXAMNAME field of backup table named allexamstable. .VIE: skips the already existing partitons. don't missout: Please don't tinker with the naming conventions being used blow. I know that it isn't same as used in indexing, but that's becouse EXAMNAME value is directly used in naming the partition. First, think it through. Don't be sorry later.
  👉🏼	DO $$
  DECLARE
  exam_table TEXT;
  partition_name TEXT;
  exam_name TEXT;
  partition_exists BOOLEAN;
  count_created INTEGER := 0;
  count_skipped INTEGER := 0;
  start_time TIMESTAMP;
  end_time TIMESTAMP;
  data_count INTEGER;
  BEGIN
  -- Record start time
  start_time := clock_timestamp();
  RAISE NOTICE 'Starting partition creation process at %', start_time;
  
  -- Loop through each distinct exam name in the source table
  FOR exam_name IN
  SELECT DISTINCT "EXAMNAME" FROM public.allexamstable
  
  LOOP
  -- Use the exact same partition naming convention as your previous code
  partition_name := replace(replace(exam_name, ' ', '_'), '/', '_');
  
  -- Check if partition already exists
  SELECT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
                AND tablename = partition_name
                ) INTO partition_exists;
                
        IF NOT partition_exists THEN
        BEGIN
        -- Create the partition
              EXECUTE format(
                'CREATE TABLE IF NOT EXISTS public.%I PARTITION OF public.allexamstable_partitioned FOR VALUES IN (%L);',
                partition_name, 
                exam_name
                );
                  
              RAISE NOTICE 'Created partition % for exam name "%"', partition_name, exam_name;
                  count_created := count_created + 1;
                  
        -- For confirmation, check how many rows now exist in this partition
              EXECUTE format(
                'SELECT COUNT(*) FROM public.%I', 
                partition_name
                ) INTO data_count;
                    
              RAISE NOTICE 'Partition % contains % rows', partition_name, data_count;
                    
                EXCEPTION WHEN OTHERS THEN
                RAISE WARNING 'Error creating partition % for exam name "%": %', partition_name, exam_name, SQLERRM;
                END;
                ELSE
              RAISE NOTICE 'Partition % already exists for exam name "%", skipping', partition_name, exam_name;
              count_skipped := count_skipped + 1;
              END IF;
              END LOOP;
                    
        -- Record end time
              end_time := clock_timestamp();
                    
        -- Summary
              RAISE NOTICE '------------------------------------';
              RAISE NOTICE 'Partition creation process complete';
              RAISE NOTICE 'Created: % new partitions', count_created;
              RAISE NOTICE 'Skipped: % existing partitions', count_skipped;
              RAISE NOTICE 'Total processing time: % seconds', EXTRACT(EPOCH FROM (end_time - start_time));
              RAISE NOTICE '------------------------------------';
                    
        -- If needed, you can add a separate step to manually copy data from backup table to partitioned table
        -- This would be necessary if data isn't already in the partitioned table
              RAISE NOTICE 'To copy data from backup to partitioned table if needed:';
              RAISE NOTICE 'INSERT INTO public.allexamstable_partitioned SELECT * FROM public.allexamstable WHERE "EXAMNAME" IS NOT NULL;';
                    
  END $$;
  the above command has to be used in the Admin4 tool or psql query tool.

step 3: use the following command in psql prompt to import .csv file into allexamstable_partitioned. 👉🏼\COPY allexamstable_partitioned FROM 'C:\Users\HP\Desktop\allexamstableoutput\C2015.csv' WITH (FORMAT csv, HEADER); Remember It:  it works only when the partition of for that exam data has already been created using the step 2.
                    
  👉2️⃣ then, you need to create the index on the fields that you want like i used the names of the distinct exams. 👉🏼 command :- on the basis of field "ROLL"
                    
                    ⚡⚡⚡ batch command for indexing battle tested solution (alternate command. last resort use only)
                    DO $$ 
                    DECLARE 
      exam_names TEXT[] := ARRAY[
        'AWO/TPO-2022', 'CAPF-2016', 'CAPF-2017', 'CAPF-2018', 'CAPF-2019', 'CAPF-2020', 'CAPF-2022', 'CAPF-2023',
        'CGL-2016', 'CGL-2017', 'CGL-2018', 'CGL-2019', 'CGL-2020', 'CGL-2021', 'CGL-2022', 'CGL-2023',
        'CHSL-2017', 'CHSL-2018', 'CHSL-2019', 'CHSL-2020', 'CHSL-2021', 'CHSL-2022', 'CHSL-2023',
        'CONSTABLE-2018', 'CONSTABLE-2021', 'CONSTABLE-2022', 'DPCST-2016', 'DPCST-2020', 'DPCST-2023',
        'DPDVR-2022', 'HC(MIN)IN DP-2022', 'IMD-2017', 'JE-2016', 'JE-2017', 'JE-2018', 'JE-2019', 'JE-2020', 
        'JE-2022', 'JE-2023', 'JHT-2016', 'JHT-2017', 'JHT-2018', 'JHT-2019', 'JHT-2020', 'JHT-2022', 'JHT-2023',
        'LDC-D-2017', 'LDC-D-2018', 'MTS-2016', 'MTS-2019', 'MTS-2020', 'MTS-2021', 'MTS-2022', 'MTS-2023',
        'SA_IMD-2022', 'STENO-2016', 'STENO-2017', 'STENO-2018', 'STENO-2019', 'STENO-2020', 'STENO-2022', 
        'STENO-2023', 'STENO-D-2017', 'UDC-D-2017'
    ];
    exam_name TEXT;
    table_name TEXT;
    index_name TEXT;
BEGIN
    FOREACH exam_name IN ARRAY exam_names
    LOOP
        -- Replace forward slashes with underscores for table name
        table_name := replace(exam_name, '/', '_');
        
        -- Replace both hyphens and slashes with underscores for index name
        index_name := replace(replace(exam_name, '/', '_'), '-', '_');
        
        EXECUTE format(
            'CREATE INDEX IF NOT EXISTS idx_exam_selected_%s ON %I ("EXAMNAME","SELECTED")',
            replace(replace(replace(index_name, '(', '_'), ')', '_'), ' ', '_'),
            table_name
        );
    END LOOP;
END $$;
Note:you may need to update this line if there is any special character problem that exists in examname, but during index creating, postgres flags those. then you will need to update this line to handle the special character like here :-replace(replace(replace(index_name, '(', '_'), ')', '_'), ' ', '_'),
⚡⚡⚡ individual command

CREATE INDEX IF NOT EXISTS idx_allexamstable_chsl_2024_student_ROLL 
ON public.allexamstable_CHSL_2024 ("ROLL");

we used "ROLL" instead of roll. becouse by default, postgres, considers the field names in small. but our database has it in capital ROLL. Hence you need to put it in the "".

⚡⚡⚡ battle tested solutionLearnByHeartMarvelRemember It: dynamic command for creating indexes 1) on basis of names
and fields to be used in indexing mentioned in array 'idx_names' and 'idx_columns'. 2) this code has facility of informative logs to see which exam is being processed. 3)VIE This code can also be used to run even when updating the indexing for new partition added. Becouse it checks if the particular indexing already exists. if not, then it makes those index. Hence naming convention being used below shouldn't be tinkered without indepth decision made in advance. 
DO $$
DECLARE
    exam_name TEXT;
    index_name_postfix TEXT;
    sql_command TEXT;
    idx_names TEXT[] := ARRAY[ -- here you mention the names of indexs to be created corresponding to idx_column array
        'idx_ROLL',
        'idx_EXAMNAME_SELECTED',
        'idx_EXAMNAME_SELECTED_ROLL',
        'idx_EXAMNAME_SELECTED_CAT1',
        'idx_EXAMNAME_SELECTED_CAT3',
        'idx_EXAMNAME_SELECTED_ALLOC_CAT',
        'idx_EXAMNAME_GENDER',
        'idx_EXAMNAME_SELECTED_GENDER',
        'idx_EXAMNAME_SELECTED_GENDER_CAT1',
        'idx_EXAMNAME_SELECTED_GENDER_ALLOC_CAT'
    ];
    idx_columns TEXT[] := ARRAY[--here you mention all the corresponding field for indexing in 'idx_names' array
        '"ROLL"',
        '"EXAMNAME","SELECTED"',
        '"EXAMNAME","SELECTED","ROLL"',
        '"EXAMNAME","SELECTED","CAT1"',
        '"EXAMNAME","SELECTED","CAT3"',
        '"EXAMNAME","SELECTED","ALLOC_CAT"',
        '"EXAMNAME","GENDER"',
        '"EXAMNAME","SELECTED","GENDER"',
        '"EXAMNAME","SELECTED","GENDER","CAT1"',
        '"EXAMNAME","SELECTED","GENDER","ALLOC_CAT"'
    ];
    exam_names TEXT[];
    i INTEGER;
    j INTEGER;
    index_start_time TIMESTAMP;
    index_end_time TIMESTAMP;
    overall_start_time TIMESTAMP;
    overall_end_time TIMESTAMP;
BEGIN
    -- Ensure the number of index names matches the number of column sets
    IF array_length(idx_names, 1) <> array_length(idx_columns, 1) THEN
        RAISE EXCEPTION 'Number of index names does not match the number of column sets.';
    END IF;
    
    -- Get all distinct exam names at once and store in array to avoid repeated queries
    SELECT array_agg(DISTINCT "EXAMNAME") INTO exam_names FROM public.allexamstable_partitioned;
    
    -- Record overall start time
    overall_start_time := clock_timestamp();
    RAISE NOTICE 'Starting all indexing operations at %', overall_start_time;
    
    -- Outer loop: iterate through each index type
    FOR i IN 1..array_length(idx_names, 1)
    LOOP
        -- Record start time for this index type
        index_start_time := clock_timestamp();
        RAISE NOTICE '----- Starting creation of % indexes at % -----', idx_names[i], index_start_time;
        
        -- Inner loop: iterate through distinct exam names
        FOREACH exam_name IN ARRAY exam_names
        LOOP
            -- Generate a safe index name from the exam name
            index_name_postfix := replace(replace(replace(replace(exam_name, '(', '_'), ')', '_'), ' ', '_'), '/', '_');
            
            RAISE NOTICE 'Creating index %_% for exam name "%"...', idx_names[i], index_name_postfix, exam_name;
            
            -- Construct the full index command(for indexing on the whole allexamstable_partitioned table)
            -- sql_command := format('CREATE INDEX IF NOT EXISTS %s_%s ON public.allexamstable_partitioned (%s);',
            --                    idx_names[i],
            --                    index_name_postfix,
            --                    idx_columns[i]);

			-- Construct the full index command
				sql_command := format('CREATE INDEX IF NOT EXISTS %s_%s ON public.%I (%s);',
				                   idx_names[i],
				                   replace(index_name_postfix, '-', '_'),  -- Replace hyphens with underscores in index name
				                   replace(exam_name, '/', '_'),  -- For table name, only replace slashes
				                   idx_columns[i]);
            
            -- Execute the create index command
            BEGIN
                EXECUTE sql_command;
                RAISE NOTICE 'Successfully created index %_% for exam name "%"', idx_names[i], index_name_postfix, exam_name;
            EXCEPTION WHEN OTHERS THEN
                RAISE WARNING 'Error creating index %_% for exam name "%": %', idx_names[i], index_name_postfix, exam_name, SQLERRM;
            END;
            
            -- Add a small delay to ensure previous transaction is fully completed
            PERFORM pg_sleep(0.1);
            
            -- Explicitly commit after each index creation
            COMMIT;
        END LOOP;
        
        -- Record end time for this index type
        index_end_time := clock_timestamp();
        RAISE NOTICE '----- Completed creation of % indexes at % (duration: % seconds) -----', 
            idx_names[i], index_end_time, EXTRACT(EPOCH FROM (index_end_time - index_start_time));
    END LOOP;
    
    -- Record overall end time
    overall_end_time := clock_timestamp();
    RAISE NOTICE 'All indexing operations completed at % (total duration: % seconds)', 
        overall_end_time, EXTRACT(EPOCH FROM (overall_end_time - overall_start_time));
END $$;


3️⃣👉 And after adding new partition or indexing on new table or data that came you need to run the following command : VIELearnByHeart

👉🏼ANALYZE public.allexamstable_CHSL_2024;
Note When to use "ANALYZE" command:
  After inserting, updating, or deleting a large number of rows.
  When optimizing queries for better performance.
  ➡️Becouse it Helps PostgreSQL choose the most efficient query execution plan (e.g., whether to use an index, perform a sequential scan, etc.).

👉🏼VACUUM ANALYZE public.allexamstable_CHSL_2024;
Note When to use "VACCUM ANALYZE":
After importing a large dataset (like your CHSL-2024 data).
When you notice queries running slower than usual.
Regularly on active tables to maintain performance.
➡️ Becouse it Removes dead rows left behind by updates and deletes (helps free up   space). Reorganizes table data for faster access.

SuperNote it will be better if you do it for whole table every time
VACUUM ANALYZE public.allexamstable_partitioned;

*/

const dotenv = require('dotenv');
dotenv.config({path:`${process.cwd()}/config.env`});//is recipe! not concept these two lines now gives eyes to our rest of code to see what's present in config.env file.😎🙏

const express = require('express');
const cors = require('cors');// this will avoid CORS error. that is differnt ports talking to each other are considered different origin and hence not allowed generally.
const app = express();
const authRouter = require('./route/authRoute');
const allexamstableModel = require('./db/models/allexamstablemodel');
const {callProcedure, callProcedtesting11, callStoredFunction, callRecordViewFunction, downloadQueryFunction} = require('./sqlscripts/dbpool');
const { getRecordsByFilters, getRecordsCountByFilters, downloadRecord } = require('./sqlscripts/queryBuilder');
const {getRecordsByFiltersDataStream} = require('./sqlscripts/queryToStreamDataFromDB');
const {citycodeDataprocessor, getModelData, modelCitycodeDataprocessor} = require('./dataprocesser/citycodeDataprocessor');
const {calculateAllStats} = require('./dataprocesser/statsCalculator');
const fs = require('fs');
const {Transform} = require('stream');
const path = require('path');
const archiver = require('archiver');
const os = require('os');
const processCancellationManager = require('./controller/processCancellationManager');
const { Pool } = require('pg');
const {pool, RequestTracker, QueryManager, comprehensiveRequestMiddleware} = require('./backendMiddlewares/processId_tracking_closing');
const {streamRecordsMiddleware} = require('./backendMiddlewares/dataStreamingforViewmiddleware');
const { timeStamp, error } = require('console');
const { getDistinctExamNames, getExamFilters } = require('./sqlscripts/postgresNativeQueryBuilder');
//newly added 04/12/2024
// const pool = new Pool({
//   // the connection configuration
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   database: process.env.DB_NAME,
//   user: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
// });

app.use(express.json());//must come before👇this line
app.use(express.urlencoded({extended: true}));// these two LOC is used againt the bodyparser code that we used to install. Now that's inbuilt in express.js and this the way you get it. 
app.use(cors({
  origin:[
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'https://mirrorverse--sscradhe.netlify.app',
    'https://sscradhe.netlify.app'//Temporary Code
    ],
  credentials: true, // Allow credentials to be sent with requests
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'x-client-id'], // Specify allowed headers
  }));// if we don't give parameter, it becomes a general instruction which is good like a shotgun . But if you want security and yet cross sharing you need to be specific like sniper. hence you give exact origin value that has to be allowed. 
app.options('*', cors());


// newly added 5/12/2024
// here we are creating a mechanism to keep track of requests being made from frontend to backend
/*
const RequestTracker = {
  activeRequests: new Map(),

  // Now tracking the requests coming for each endpoint
  trackRequest(endpoint, clientId){
    const previousRequest = this.activeRequests.get(endpoint);

    //If there was a previous request, mark it for cancellation using 'shouldCancel' flag.
    if (previousRequest) {
      previousRequest.shouldCancel = true;
    };

    // For tracking the new request,
    this.activeRequests.set(endpoint, {
      clientId,
      shouldCancel: false,
      timeStamp: Date.now()
    });
  },

  //Place where actually the cancellation of the request is decided
  shouldCancelRequest(endpoint, currentClientId){
    const trackedRequest = this.activeRequests.get(endpoint);
    return  trackedRequest && trackedRequest.clientId !== currentClientId && trackedRequest.shouldCancel;
  },

  //to Clear old requests to prevent memory Leaks. It's optional and should be suppressed becouse it uses active wait to clean the memory. we don't need it. It's intention was to avoid any memory leakages. But my project architecture is such that from request is being sent from frontend to backend, the request are ultralight weight. Not even a KB in size.
//  
  // cleanupOldRequests(){
  //   const now= Date.now();
  //   for(const [endpoint, request] of this.activeRequests.entries()){
  //     //Removing requests older than 5 minutes. We can use any other condition as well
  //     if (now - request.timeStamp > 5*60*1000) {
  //       this.activeRequests.delete(endpoint);
  //     } 
  //   }
  // },
//
};
*/
//newly added 4/12/2024
/*
const QueryManager = {
  activeQueries:  new Map(),

  //here we shall track queries
  trackQuery(clientId, pgClient, queryContext){
    this.activeQueries.set(clientId, {
      pgClient,
      queryContext,
      startTime: Date.now()
    });
  },

  //VIE canceling a specific query
  async cancelQuery(clientId) {
    const queryEntry=this.activeQueries.get(clientId);
    if(queryEntry && queryEntry.pgClient){
      try {
        // promptly cancel the query using PostgreSQL's command pg_cancel_backend
        await queryEntry.pgClient.query(`SELECT pg_cancel_backend(pg_backend_pid())`);
        console.log(`Query for client ${clientId} cancelled`);//Code Testing
        
      } catch (error) {
        console.log('Query already completed or could not be cancelled', error);
      } finally{
        this.removeQuery(clientId);
      };
    };
  },
  //remove a completed or cancelled query
  removeQuery(clientId){
    this.activeQueries.delete(clientId);
  },
};
*/
// Enhanced Middleware to integrate all tracking mechanisms
//newly added 9/12/2024
/*
const comprehensiveRequestMiddleware = (req, res, next) => {	
  const endpoint = req.path;
  const clientId = req.headers['x-client-id'];

  // Generate process cancellation token
  req.processCancellationManager = processCancellationManager.generateToken();

  // Track request in RequestTracker
  RequestTracker.trackRequest(endpoint, clientId);

  // Start tracking process
  processCancellationManager.startProcess(req.processCancellationToken, {
    endpoint,
    clientId,
    method: req.method,
  });
  next();
};
*/
// Apply comprehensive middleware
app.use(comprehensiveRequestMiddleware);

app.get('/', (request, response) => {
    response.status(200).json({
    status: '200',
    //requestedAt: request.requestTime,
    message: 'restAPI is working'
    });
});

//this is the area where all the routes will be placed.
app.use('/api/v1/auth',authRouter);

//SuperConceptVIERemember It:
app.get('/api/v1/100allexamstable', async (request, response) => {	// for Code Testing
    try {
        // to Fetch only 100 records from the allexamstable table Marvel
        /*Note that there is no 'id' field declared. it's default field that postgres adds to you database. But we suppressed it's default behaviour in allexamstablemodel.js */
        const records = await allexamstableModel.findAll({attributes: ['EXAMNAME','REGID','ROLL','NAME','FATHERNAME','MOTHERNAME', 'DOB','GENDER','CAT1','CAT2','CAT3','WRTN1_APP','WRTN1_QLY','WRTN2_APP','WRTN2_QLY','WRTN3_APP','WRTN3_QLY','INTVW_APP','SKILL_APP','SKILL_QLY','PET_APP','PET_QLY','DME_APP','DME_QLY',    'RME_APP','RME_QLY','SELECTED','MARKS',      'ALLOC_POST','ALLOC_STAT','ALLOC_AREA', 'ALLOC_CAT','RANK','WITHHELD'],limit:100});
        response.status(200).json({
            status: '200',
            message: 'allexamstable table records fetched successfully',
            data: records,
        });
    }catch(error){
        console.error('Error fetching data from allexamstable:', error)
        response.status(500).json({
            status: '500',
            message: 'Internal Server Error',
        });
	}
});
app.get('/api/v1/10000allexamstable', async (request, response) => {	// for Code Testing 
    try {
        // to Fetch only 100 records from the allexamstable table
        const records = await allexamstableModel.findAll({attributes: ['EXAMNAME','REGID','ROLL','NAME','FATHERNAME','MOTHERNAME', 'DOB','GENDER','CAT1','CAT2','CAT3','WRTN1_APP','WRTN1_QLY','WRTN2_APP','WRTN2_QLY','WRTN3_APP','WRTN3_QLY','INTVW_APP','SKILL_APP','SKILL_QLY','PET_APP','PET_QLY','DME_APP','DME_QLY',    'RME_APP','RME_QLY','SELECTED','MARKS',      'ALLOC_POST','ALLOC_STAT','ALLOC_AREA', 'ALLOC_CAT','RANK','WITHHELD'],limit:10000});
        response.status(200).json({
            status: '200',
            message: 'allexamstable table records fetched successfully',
            data: records,
        });
    }catch(error){
        console.error('Error fetching data from allexamstable:', error)
        response.status(500).json({
            status: '500',
            message: 'Internal Server Error',
        });
	}
});// this is route for Code Testing

//Super path to call first callProcedure function
app.get('/api/v1/viewQuery', async (request, response) => {	
    try {
        // to Fetch only 100 records from the allexamstable table
        const records= await callStoredFunction('viewQueryFunction1',['allexamstable']);
        response.status(200).json({
            status: '200',
            message: 'function executed successfully',
            data: records,
        });
    }catch(error){
        console.error('Error fetching data from allexamstable:', error);
        response.status(500).json({
            status: '500',
            message: 'Internal Server Error',
        });
	}
});
app.get('/api/v1/viewNumberOfRecords', async (request, response) => {	
    try {
        // to Fetch only 100 records from the allexamstable table
        const records= await callRecordViewFunction('viewrecords1',['allexamstable']);
        response.status(200).json({
            status: '200',
            message: 'function executed successfully',
            data: records,
        });
    }catch(error){
        console.error('Error fetching data from allexamstable:', error);
        response.status(500).json({
            status: '500',
            message: 'Internal Server Error',
        });
	}
});
// path to call second callProcedure function
app.get('/api/v1/downloadQuery1', async (request, response) => {
    try {
      const filePaths = await downloadQueryFunction('split_downloadqueryfunctionsscdatabase1', ['allexamstable']);
      
      // Create a zip file
      const zipFilename = `download_${Date.now()}.zip`;
      const zipFilePath = path.join(process.env.DB_File_DownloadedAt, zipFilename);
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver('zip', { zlib: { level: 9 } });
  
      output.on('close', () => {
        console.log('Archive created successfully');
        
        // Send the zip file
        response.download(zipFilePath, zipFilename, (err) => {
          if (err) {
            console.error('Error sending file:', err);
            response.status(500).send('Error sending file');
          }
          
          // Clean up: delete the zip file and original CSV files
          fs.unlinkSync(zipFilePath);
          filePaths.forEach(filePath => fs.unlinkSync(filePath));
        });
      });
  
      archive.on('error', (err) => {
        throw err;
      });
  
      archive.pipe(output);
  
      // Add CSV files to the zip
      filePaths.forEach(filePath => {
        archive.file(filePath, { name: path.basename(filePath) });
      });
  
      archive.finalize();
  
    } catch (error) {
      console.error('Error fetching data from allexamstable:', error);
      response.status(500).json({
        status: '500',
        message: 'Failed to download successfully.🥴',
      });
    }
  });
/*legacy code👇code upgrade👆
app.get('/api/v1/downloadQuery1', async (request, response) => {	
    try {
        // to Fetch only 100 records from the allexamstable table
         await downloadQueryFunction('split_downloadqueryfunctionsscdatabase',['allexamstable']);
        response.status(200).json({
            status: '200',
            message: `Download successful. check folder ${process.env.DB_File_DownloadedAt}`,
        });
    }catch(error){
        console.error('Error fetching data from allexamstable:', error);
        response.status(500).json({
            status: '500',
            message: 'Failed to download successfully.🥴',
        });
	}
});
*/


//---------------------REAL USE STARTS FROM HERE---------------------
// Super: from here on, i am using Sequelize and node.js itself to do the query and get the output from the database based on the filter that we have made in node.js for sequelize. Note: we are choosing to receive the parameters for the filter from "request body" not the "request query". Becouse request body is better suited to deal with complex filters and large amount of data to be handled. 
/*forced stop
app.post('/api/v1/records', async (req, res) => {
    try {
      const filters = req.body;// i am not using request query like "req.query.EXAMNAME". It's useful for straigh forward, less complex shit.
      const limit = req.query.limit || 1000;
      const offset=req.query.offset || 0;
      const records = await getRecordsByFilters(filters,limit,offset);
      res.status(200).json(records);
    } catch (error) {
      console.error('Error fetching records:', error);
      res.status(500).json({ 
        error: 'Failed to fetch records',
        status:'500',
        message: 'Failed to fetch.'
        });
    }
  });
*/
/*newly added 11/12/2024 client compatible
app.post('/api/v1/records', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  const processCancellationToken = processCancellationManager.generateToken();

  const processRecords = processCancellationManager.createCancellableProcess(
    async (processToken, cancellationCheck) => {
      const client = await pool.connect();
      try {
        // Track query in QueryManager
        QueryManager.trackQuery(clientId, client);

        const filters = req.body;
        const limit = req.query.limit || 1000;
        const offset = req.query.offset || 0;

        // Periodic cancellation check
        cancellationCheck();

        const records = await getRecordsByFilters(filters, limit, offset,client);
        
        // Another cancellation check before returning
        cancellationCheck();

        return records;
      } finally {
        QueryManager.removeQuery(clientId);
        client.release();
      }

    }
  );

  try {
    const result = await processRecords(processCancellationToken);

    if (result.cancelled) {
      return res.status(499).json({ 
        error: 'Process cancelled', 
        reason: result.reason 
      });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ 
      error: 'Failed to fetch records',
      status: '500',
      message: 'Failed to fetch.'
    });
  }
});
*/
//code upgradenewly added 25/12/2024
app.post('/api/v1/records-stream', streamRecordsMiddleware);

app.post('/api/v1/downloadrecords', async (req, res) => {
    try {
      const filters = req.body;
      const limit = req.query.limit || 20000;
      const offset=req.query.offset || 0; 
      console.log(filters);//Code Testing

      const zipFilePath=await downloadRecord(filters,limit,offset);
      res.download(zipFilePath, 'downloaded_data.zip', (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(500).send('Error sending file');
        }
        // Delete the temporary zip file after sending
        fs.unlinkSync(zipFilePath);
      });
    } catch (error) {
      console.error('Error Downloading records:', error);
      res.status(500).json({ 
        error: 'Failed to download the records',
        status: '500',
        message: 'Failed to Download.'
      });
    };
     // legacy code👇code in progress👆
    //   const recordsDownloaded = await downloadRecord(filters,limit,offset);
    //   res.status(200).json(recordsDownloaded);
    // } catch (error) {
    //   console.error('Error Downloading records:', error);
    //   res.status(500).json({ 
    //     error: 'Failed to download the records',
    //     status:'500',
    //     message: 'Failed to Download.'
    //     });
    // }
    //
  });
 
/*forced stop
app.post('/api/v1/recordcount', async (req, res) => {
    try {
      const filters = req.body;
      //const limit = req.query.limit || 1000;
      //const offset=req.query.offset || 0; 
      const totalRecordCount = await getRecordsCountByFilters(filters);
      res.status(200).json(totalRecordCount);
    } catch (error) {
      console.error('Error fetching records:', error);
      res.status(500).json({ error: 'Failed to fetch records' });
    }
  });
*/
//code upgradenewly added 12/12/2024
app.post('/api/v1/recordcount', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  const processCancellationToken = processCancellationManager.generateToken();
  console.log(`in backend /recordcount path:- clientId: ${clientId} processCancellationToken: ${processCancellationToken}`);//debugging log
  
  const processRecordCount = processCancellationManager.createCancellableProcess(
    async (processToken, cancellationCheck) => {	
      const client = await pool.connect();
      try {
        const filters = req.body;
        // const limit = req.query.limit || 1000;
        // const offset = req.query.offset || 0;
        cancellationCheck();
        const totalRecordCount = await getRecordsCountByFilters(filters);
        cancellationCheck();
        return totalRecordCount;
      } finally{
        QueryManager.removeQuery(clientId);
        client.release();
      }
    }
  );
  try {
    // Executing the cancellable process
    const result = await processRecordCount(processCancellationToken);

    // Handle process result
    if (result.cancelled) {
      return  res.status(499).json({
        error: 'Process got cancelled 😼😵‍💫',
        reason: result.reason
      });
    }
    res.status(200).json(result);
  } catch (error) {
    if (error.code === '57014') {
      res.status(499).json({error: 'Query cancelled 😼'});
    } else {
      console.error('Error fetching the Record count:', error);
      res.status(500).json({error: 'Failed to fetch the Record Count 😵‍💫'});
    }
  }
});

/*forced stop Reason: working on another API endpoint with client facility
app.post('/api/v1/summarytablestats', async (req, res) => {
    try {
        const filters = req.body;
        const limit = req.query.limit || 1000;
        const offset=req.query.offset || 0;
        const stats = await calculateAllStats(filters, limit, offset);
        console.log(filters);
        
        res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching the Stats for the summary table:', error);
        res.status(500).json({ error: 'Failed to fetch the summary table records' });
    };
});
*/
// code upgradenewly added 4/12/2024
app.post('/api/v1/summarytablestats', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  const processCancellationToken = processCancellationManager.generateToken();

  // Wrap data processing in a cancellable process
  const processSummaryStats = processCancellationManager.createCancellableProcess(
    async (processToken, cancellationCheck) => {
      const client = await pool.connect();

      try {
        // Track query in QueryManager
        QueryManager.trackQuery(clientId, client);

        const filters = req.body;
        const limit = req.query.limit || 1000;
        const offset = req.query.offset || 0;

        // Periodic cancellation check
        cancellationCheck();

        const stats = await calculateAllStats(filters, limit, offset, client);
        
        // Another cancellation check before returning
        cancellationCheck();

        return stats;
      } finally {
        QueryManager.removeQuery(clientId);
        client.release();
      }
    }
  );

  try {
    // Execute the cancellable process
    const result = await processSummaryStats(processCancellationToken);

    // Handle process result
    if (result.cancelled) {
      return res.status(499).json({ 
        error: 'Process cancelled', 
        reason: result.reason 
      });
    }

    res.status(200).json(result);
  } catch (error) {
    if (error.code === '57014') {
      res.status(499).json({error: 'Query cancelled'});
    } else {
      console.error('Error fetching the Stats from the summary Table:', error);
      res.status(500).json({error: 'Failed to fetch the summary table records'});
    }
  }
});

/*forced stop Reason: working on another API endpoint that has clientId facility in it. 
app.post('/api/v1/venuerecords', async (req, res) => {
    try {
        const filters = req.body;
        const limit = req.query.limit || 1000;
        const offset = req.query.offset || 0;
        
        //to get the model data
        const examName = filters.EXAMNAME;
        const modelData = await getModelData(examName, limit, offset);
        // console.log(modelData);// Code Testing
        const modelStats = modelCitycodeDataprocessor(modelData);
        console.log(modelStats);// Code Testing
        
        
        
        // Process the records to get counts of the student based on user conditions
        const records = await getRecordsByFilters(filters, limit, offset);
        const processedData = citycodeDataprocessor(records, modelStats);
        
        res.status(200).json({
            records: processedData,
            //statistics: processedData//SuperConcept in this parameter we send any other data that we may have calculated using the main records that we have fetched from the data base. like some kind of percentage of students being SC or ST. In this parameter we send those parameters like {totalSCPercent,averageAgeSc,}, where totalSCPercent or averageAgeSc is are variables that holds the calculated data from the records fetched.
        });
    } catch (error) {
        console.error('Error fetching Venue Records:', error);
      res.status(500).json({
        error: 'Failed to fetch the venue records',
        status:'500',
        message: 'Failed to fetch.'
        });
    }
});
*/
//code upgradenewly added 4/12/2024
app.post('/api/v1/venuerecords', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  const endpoint =req.path;
  const processCancellationToken = req.processCancellationToken;

    try {
        // Checking if this request need to cancel the previous one which was running before it. That is, you need to cancel if something is already running out there. 
        if (RequestTracker.shouldCancelRequest(endpoint, clientId)) {
          await QueryManager.cancelQuery(clientId);
          processCancellationManager.cancelProcess(processCancellationToken, 'Conflicting request');
          return res.status(499).json({error: 'Request cancelled'});
        };

        // Wraping the data processing related functions to form a cancellableProcess
        const processvenueRecords = processCancellationManager.createCancellableProcess(
          async (processToken, cancellationCheck) => {
            const pgClient = await pool.connect();

            try{
              //Track the query
              QueryManager.trackQuery(clientId, pgClient, {
                endpoint: '/api/v1/venuerecords',
                filters: req.body,
              });
            // Periodic cancellation checks
            cancellationCheck();

            const filters = req.body;
            const limit = req.query.limit || 1000;
            const offset = req.query.offset || 0;

            //to get the model data
            const examName = filters.EXAMNAME;
            const modelData = await getModelData(examName, limit, offset, pgClient);
            //console.log(modelData);// debugging log

            cancellationCheck();

            const modelStats = modelCitycodeDataprocessor(modelData);
            // console.log(modelStats);// debugging log
              
            cancellationCheck();

            // Process the records to get counts of the student based on user conditions
            const records = await getRecordsByFilters(filters, limit, offset, pgClient);

            cancellationCheck();

            return {
              records: citycodeDataprocessor(records, modelStats)
            };
            } finally {
              QueryManager.removeQuery(clientId);
              pgClient.release();
            };
          }
        );

        //Execute the cancellable process
        const result = await processvenueRecords(processCancellationToken);

        //Handle process result
        if(result.cancelled){
          return res.status(499).json({
            error: 'Process cancelled',
            reason: result.reason,
          });
        };

        res.status(200).json(result);

      } catch (error) {
        if (error.code === '57014'){
          res.status(499).json({error: 'Query cancelled'});
        } else {
          console.error('Error fetching Venue Records:', error);
          res.status(500).json({
            error: 'Failed to fetch the venue records',
            status:'500',
            message: 'Failed to fetch.'
          });
        }
    }
});

// API endpoint to get distinct exam names(called on page load to populate the EXAMs dropdown div)
app.post('/api/v2/examnames',async (req, res) => {
  const clientId = req.headers['x-client-id'];
  const processCancellationToken = processCancellationManager.generateToken();

  const getExamNamesProcess = processCancellationManager.createCancellableProcess(
          async (processToken, cancellationCheck) => {
            const client = await pool.connect();
            try {

              cancellationCheck();
              const distinctExamNames = await getDistinctExamNames(client);
              // console.log('distinctExamNames:', distinctExamNames);//debugging log
              
              cancellationCheck();

              return distinctExamNames;
            } finally {
              QueryManager.removeQuery(clientId);
              client.release();
            }
          }
        );

  try {
    const result = await getExamNamesProcess(processCancellationToken);

    // Handle process result
    if (result.cancelled) {
      return res.status(499).json({
        error: 'Process cancelled',
        reason: result.reason
      });
    }
    res.status(200).json(result);
  } catch (error) {
    if (error.code === '57014') {
      res.status(499).json({error: 'Query cancelled'});
    } else {
      console.error('Error fetching distinct exam names:', error);
      res.status(500).json({error: 'Failed to fetch distinct exam names'});
    }
  }


});

app.post('/api/v2/examnames/filters', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  // const examName = req.params;
  // console.log('using req.params.examname => examName = ',req.params.examname);//debugging log
  
  // console.log('using req.params => examName = ',req.params);//debugging log
  const examName = req.body.EXAMNAME;
  console.log('using req.body => examName = ', req.body);//debugging log
  
  
  const processCancellationToken = processCancellationManager.generateToken();

  const getExamFiltersProcess = processCancellationManager.createCancellableProcess(
    async (processToken, cancellationCheck) => {
      const client = await pool.connect();
      try {
        cancellationCheck();
        const filters = await getExamFilters(examName, client);
        console.log('examName:\n',examName,'\n','client: ',client);//debugging log
        
        cancellationCheck();
        return filters;
      } finally {
        QueryManager.removeQuery(clientId);
        client.release();
      }
    }
  );

  try {
    const result = await getExamFiltersProcess(processCancellationToken);

    // Handle process result
    if (result.cancelled) {
      return res.status(499).json({
        error: 'Process cancelled',
        reason: result.reason
      });
    }
    res.status(200).json(result);
  } catch (error) {
    if (error.code === '57014') {
      res.status(499).json({error: 'Query cancelled'});
    } else {
      console.error('Error fetching exam filters:', error);
      res.status(500).json({error: 'Failed to fetch exam filters'});
    }
  }
})



// app.post('/api/v1/databaserecordsupdate', async (req, res) => {
//   const clientId = req.headers['x-client-id'];
//   const processCancellationToken = processCancellationManager.generateToken();

//   const databaseRecordsUpdateCancellableProcess = processCancellationManager.createCancellableProcess(
//     async (processToken, cancellationCheck) => {	
//       const client = await pool.connect();
//       try {
//         cancellationCheck();
//         const distinctExamNames = await getDistinctExamNames(client);
//         // console.log(Array.isArray(distinctExamNames));//Code Testing // true
//         cancellationCheck();
//         return distinctExamNames;
//       } finally{
//         QueryManager.removeQuery(clientId);
//         client.release();
//       }
//     }
//   );
//   try {
//     // Executing the cancellable process inside which our real backend work is happening.
//     const result = await databaseRecordsUpdateCancellableProcess(processCancellationToken);

//     // Handle process result
//     if (result.cancelled) {
//       return  res.status(499).json({
//         error: 'Process cancelled',
//         reason: result.reason
//       });
//     }
//     res.status(200).json(result);
//   } catch (error) {
//     if (error.code === '57014') {
//       res.status(499).json({error: 'Query cancelled'});
//     } else {
//       console.error('Error fetching the distinct exam names:', error);
//       res.status(500).json({error: 'Failed to fetch the distinct exam names'});
//     }
//   }
// });// code abandoned

//Note: Endpoint to manually cancel a process. This endpoint is meant to be used such that a button is pressed on frontend, and it will abort the ongoing process in the backend using the passed token.

app.post('/api/v1/cancel-process', (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ error: 'Process token is required' });
  }

  processCancellationManager.cancelProcess(token, 'User-initiated cancellation');
  
  res.status(200).json({ 
    message: 'Process cancellation requested in direct manner.',
    token 
  });
});


//Note: this is for anything else you give in the path that hasn't been declared. So this will fire. 
app.use('*',(request, response, next) =>{
response.status(404).json({
    status:'fail',
    message: `route not found. we Don't have resource that you are looking for.`
});
});


const port=process.env.PORT || 3000;//Take A Good Look
app.listen( port, ()=>{
 console.log(` ---SERVER: allexamstable_backend : LISTENING--- PORT NUMBER: ${port}`)});
  
//SuperNoteLearnByHeart: if some program is already using the port value in the "port" or 3000(as written above), you can either change the port number in .env file or use these👇🏼 commands in cmd to kill the process running at this port and then your server will work.  👉🏼 netstat -ano | findstr :3000 this will the process ID running at that port number. YOu need this process id to excute kill commmand to free the port. 👉🏼 taskkill /PID <PID> /F this will kill the process running on let's say port number 3000. Don't forget to write /F, it means that you are forceing to stop the process, else it will not terminate on it's free will. 👉🏼 tasklist /FI "PID eq <PID>" this command will help you know more about the process running with that porcess ID, so that you know more the process you are about to kill or general investigation. 
