#import libraries and setting csv data path
import os
import csv
bank_csv = os.path.join('.', 'Resources', 'budget_data.csv')

# Using code from class activities to read csv
with open(bank_csv, 'r') as csvfile:
    csvreader = csv.reader(csvfile, delimiter=',')

    # Initialize vars
    total_months = 0
    net_gain = 0
    greatest_loss = 0
    greatest_inc = 0
    # skipping header using next()
    header = next(csvreader)

    for row in csvreader:
        gain = float(row[1])
        total_months += 1
        net_gain += gain

        # compare and set greatest, if equal value picks first entry
        if gain > greatest_inc:
            greatest_inc = gain
            greatest_incDate = row[0]
        elif gain < greatest_loss:
            greatest_loss = gain
            greatest_lossDate = row[0]

    # write to an output text file using \n for new lines
    outpath = os.path.join('.', "Output.txt")
    with open(outpath, 'w') as text:
        text.write("Financial Analysis \n")
        text.write("-" * 40 + "\n")
        text.write(f"Total Months: {total_months} \n")
        text.write(f"Total: ${net_gain} \n")
        text.write(f"Average Change: ${net_gain/total_months} \n")
        text.write(
            f"Greatest Increase in Profits: {greatest_incDate} (${greatest_inc}) \n")
        text.write(
            f"Greatest Increase in Profits: {greatest_lossDate} (${greatest_loss}) \n")

    # print out results in terminal
    print("Financial Analysis")
    print("-"*50)
    print(f"Total Months: {total_months}")
    print(f"Total: ${net_gain}")
    print(f"Average Change: ${net_gain/total_months}")
    print(
        f"Greatest Increase in Profits: {greatest_incDate} (${greatest_inc})")
    print(
        f"Greatest Increase in Profits: {greatest_lossDate} (${greatest_loss})")
