#Import regex and os
import os
import re
# Set file to read, input dfferent number to read different files
filenumber=input("Please Enter File Number ")
file_path=os.path.join(".","raw_data",f"paragraph_{filenumber}.txt")

with open(file_path,"r",encoding="utf-8") as text:
    #Read file into a string
    paragraph=text.read()
    #Create a list of words
    words=paragraph.split()

    #Splits paragraph in to a list of lines, where each line is a string
    sen_linesplit=re.split(r'[\r\n]+',paragraph)
    sentances=[]

    # For each line split text into sentences that ends with .!?
    for sentance in sen_linesplit:
        sentanceOfEachLine=re.split("(?<=[.!?]) +", sentance)
        # Add each sentence into one counting list
        for sen in sentanceOfEachLine:
            sentances.append(sen)

    # Count total number of words
    letter_count=0
    for word in words:
        letter_count += len(word)
    # Print results using len of lists generated
    print("Paragraph Analysis")
    print("-" * 50)
    print(f"Approximate Word Count: {len(words)}")
    print(f"Approximate Sentence Count: {len(sentances)}")
    print(f"Average Letter Count: {round(letter_count/len(words),4)}")
    print(f"Average Sentence Length: {round(len(words)/len(sentances),4)}")
    