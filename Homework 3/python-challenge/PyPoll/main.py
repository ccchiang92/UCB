#Using code from PyBank's main.py as starter

#import libraries and setting csv data path
import os
import csv
bank_csv = os.path.join('.', 'Resources', 'election_data.csv')

# Using code from class activities to read csv
with open(bank_csv, 'r') as csvfile:
    csvreader = csv.reader(csvfile, delimiter=',')

    # Initialize vars
    # Using a dictionary to store candidates as a name and vote total pair
    total_votes = 0
    candidates = {}
    # skipping header using next()
    header = next(csvreader)

    for row in csvreader:
        total_votes += 1
        candidate_name = row[2]
        #if candidate name is already in add one vote else initialize
        if candidate_name in candidates:
            candidates[candidate_name] += 1
        else:
            candidates[candidate_name] = 1

    # Print results into terminal and write to output at the same time

    outpath = os.path.join('.', "Output.txt")
    with open(outpath, 'w') as out_text:
        print("Election Results")
        out_text.write("Election Results \n")
        print("-"*50)
        out_text.write("-"*50+"\n")
        print(f"Total Votes: {total_votes}")
        out_text.write(f"Total Votes: {total_votes} \n")
        #init var for comparing winner
        winner=''
        winner_votes=0
        #for each name in candidates print results and check who has most votes
        for cand in candidates:
            votes=candidates[cand]
            vote_percent = round(votes/total_votes*100, 6)
            if votes>winner_votes:
                winner_votes=votes
                winner=cand
            print(f"{cand}: {vote_percent}%, Votes: {votes}")
            out_text.write(f"{cand}: {vote_percent}%, Votes: {votes} \n")
        print("-"*50)
        out_text.write("-"*50+"\n")
        print(f"Winner: {winner}")
        out_text.write(f"Winner: {winner}")

    
