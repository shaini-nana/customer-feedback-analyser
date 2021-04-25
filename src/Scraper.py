import json
import os
from urllib.request import urlopen
from bs4 import BeautifulSoup
import csv

class Scraper:

    def __init__(self, businessName):
        self.business = businessName
        self.filename = "../reviews/scrapedReviews/" + businessName + ".csv"
        self.base_urls = []

    def get_review_web_links(self):
        with open("./scraperWebLocations/{}.txt".format(self.business), "r") as fp:
            line = fp.readline()
            cnt = 0
            while line:
                if line.strip() not in self.base_urls:
                    self.base_urls.append(line.strip())
                cnt += 1
                line = fp.readline()

        print("Total web locations obtained: ", self.base_urls.__len__())


    def get_review_rating(self, value):
        res = '3'
        if value == '5 star rating' or value == '4 star rating':
            res = '1'
        elif value == '1 star rating' or value == '2 star rating':
            res = '2'
        return res


    def get_scraped_data(self):

        review_count = 1
        location_index = 0
        start = 0

        if os.path.exists(self.filename):
            os.remove(self.filename)
            print("Deleted already existing scraped data file ", self.filename)

        for index, base_url in enumerate(self.base_urls, start=0):
            if location_index == 0 or index >= location_index:
                csv_file = open(self.filename, '+a')
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
                        review_comment = div.find(
                            "p", {"class": "comment__373c0__1M-px css-n6i4z7"}).text

                        writer = csv.writer(csv_file)
                        file_content = str(review_count) + "|" + self.get_review_rating(star_rating) + "|" + review_comment
                        writer.writerow([file_content])
                        review_count += 1

                csv_file.close()
                start = 0
                print("Percentage: {} Finished: {} BaseUrl Completed: {} ".format(
                    (index/self.base_urls.__len__())*100, index, base_url))


scraper = Scraper("the-cheesecake-factory")
scraper.get_review_web_links()
scraper.get_scraped_data()
