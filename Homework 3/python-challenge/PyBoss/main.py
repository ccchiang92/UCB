# import libraries and setting csv data path
import os
import csv
# Downloaded abbreviations into same folder and import
import us_state_abbrev as state_abb
boss_csv = os.path.join('.', 'Resources', 'employee_data.csv')

# Using code from class activities to read csv
with open(boss_csv, 'r') as csvfile:
    csvreader = csv.reader(csvfile, delimiter=',')
    # Skipping header using next()
    header = next(csvreader)
    # Will produce output.csv at the same directory
    output_path = os.path.join(".", "output.csv")

    # Using class activity code as starter for writing csv
    with open(output_path, 'w', newline='') as csvfile:
        # Initialize csv.writer
        csvwriter = csv.writer(csvfile, delimiter=',')
        # Write header for output
        csvwriter.writerow(
            ["Emp ID", "First Name", "Last Name", "DOB", "SSN", "State"])
        # Iterate through the rows of source file
        for row in csvreader:
            ID = row[0]
            # Using the split function to split strings
            first_name, last_name = row[1].split()
            BList = row[2].split("-")
            DOB = f"{BList[1]}/{BList[2]}/{BList[0]}"
            # Running thorugh SSN and censor the first 6 digits
            SSN = ""
            for i, num in enumerate(row[3]):
                if i < 6 and i != 3:
                    SSN += "*"
                else:
                    SSN += num
            # Calling the dictionary from import
            state = state_abb.us_state_abbrev[row[4]]
            # Write processed info onto output
            csvwriter.writerow([ID, first_name, last_name, DOB, SSN, state])
