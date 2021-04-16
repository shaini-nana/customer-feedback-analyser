import json
import os
from urllib.request import urlopen
from bs4 import BeautifulSoup
import csv

business = 'hilton'
base_urls = []

with open("./scraperWebLocations/{}.txt".format(business), "r") as fp:
    line = fp.readline()
    cnt = 0
    while line:
        if line.strip() not in base_urls:
            base_urls.append(line.strip())
        cnt += 1
        line = fp.readline()

print("Total web locations obtained: ", base_urls.__len__())

review_count = 1
location_index = 0
start = 0

def get_review_rating(value):
    print('Value: ', value)
    res = '3'
    if value == '5 star rating' or value == '4 star rating':
        res = '1'
    elif value == '1 star rating' or value == '2 star rating':
        res = '2'
    elif value == '3 star rating':
        res = '4'
    return res

filename = "../reviews/scrapedReviews/" + business + ".csv"
if os.path.exists(filename):
    os.remove(filename)
    print("Deleted already existing file ", filename)

for index, base_url in enumerate(base_urls, start=0):
    if location_index == 0 or index >= location_index:
        # text_file = open(filename, "a+")
        csv_file = open(filename, '+a')
        print("Scraping started for: ", base_url)
        html = urlopen(base_url)
        soup = BeautifulSoup(html, 'html.parser')
        limit = soup.find("div", {
                          "class": "border-color--default__373c0__2oFDT text-align--center__373c0__1l506"})
        totalPage = int(limit.text.strip().split(' ')[2])
        for i in range(start, totalPage):
            html = urlopen(base_url + "?start={}".format(i*20))
            print(base_url + "?start={}".format(i*20))
            soup = BeautifulSoup(html, 'html.parser')
            review_divs = soup.findAll(
                "div", {"class": "review__373c0__13kpL border-color--default__373c0__2oFDT"})
            for div in review_divs:
                star_rating = div.find("span", {
                                       "class": "display--inline__373c0__2SfH_ border-color--default__373c0__30oMI"}).div['aria-label']
                review_date = div.find("div", {"class": "arrange__373c0__UHqhV gutter-1__373c0__2B2sK vertical-align-middle__373c0__2TQsQ border-color--default__373c0__2oFDT"}).findChildren()[-1].text
                review_comment = div.find(
                    "p", {"class": "comment__373c0__1M-px css-n6i4z7"}).text

                writer = csv.writer(csv_file)
                fileContent = str(review_count) + "|" + get_review_rating(star_rating) + "|" + review_comment
                writer.writerow([fileContent])
                review_count += 1

        # text_file.close()
        csv_file.close()
        start = 0
        print("Percentage: {} Finished: {} BaseUrl Completed: {} ".format(
            (index/base_urls.__len__())*100, index, base_url))
