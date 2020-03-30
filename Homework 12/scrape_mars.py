from splinter import Browser
from bs4 import BeautifulSoup
import pandas as pd
import requests
import time

def scrape():
    # Initializing driver
    executable_path = {'executable_path': 'chromedriver.exe'}
    browser = Browser('chrome', **executable_path, headless=False)

    # First website to scrape
    nasa_url = 'https://mars.nasa.gov/news/'
    browser.visit(nasa_url)
    # need to wait for the website to load
    time.sleep(2)
    # Find title and excerpt with beautiful soup
    html = browser.html
    soup = BeautifulSoup(html, "html.parser")
    news_slide = soup.find('div', class_='list_text')
    news_title = news_slide.find('div', class_='content_title').find('a').text
    news_paragraph = news_slide.find('div', class_="article_teaser_body").text
    # news_title='a'
    # news_paragraph='b'

    # Second website to scrape
    img_url = 'https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars'
    browser.visit(img_url)
    # Navagate to details page for full res link
    browser.click_link_by_partial_text('FULL IMAGE')
    browser.click_link_by_partial_text('more info')
    # parse into beautiful soup
    html = browser.html
    soup = BeautifulSoup(html, "lxml")
    # find download link, [1] because the jpeg link is the second one
    img_link = soup.find_all(class_ = "download_tiff")[1].p.a['href']

    # Third scrape
    twitter_url = "https://twitter.com/marswxreport?lang=en"
    html = requests.get(twitter_url)
    soup = BeautifulSoup(html.text, 'html.parser')
    # Using some code from office hours below
    timeline = soup.select('#timeline li.stream-item')
    for tweet in timeline:
        tweet_text = tweet.select('p.tweet-text')[0].get_text()
        # first tweet that contain weather strings, store weather and break
        if tweet_text.find('ºC')!= -1 and tweet_text.lower().find('sol') != -1:
            weather = tweet_text.split('hPapic')[0]
            break

    # Read html into panda data frame and then covert back only the table
    facts_url = 'https://space-facts.com/mars/'
    facts_tables = pd.read_html(facts_url)
    table_string = facts_tables[0].to_html()

    # fifth scrape
    hemi_url="https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars"
    browser.visit(hemi_url)
    hemi_urls = []
    img_links = browser.find_link_by_partial_text('Enhanced')
    for i in range(len(img_links)):
        # for each img link needs to grap link again after each visit
        browser.find_link_by_partial_text('Enhanced')[i].click()
        # parse into beautiful soup
        html = browser.html
        soup = BeautifulSoup(html, "lxml")
        # add dictionaries to list
        # found titles and links with beautiful soup
        hemi_urls.append({'title': soup.find('title').text.split('Enhanced')[0][0:-1], 'img_url': soup.find('div', class_='downloads').ul.find_all('li')[0].a['href']})
        # go back to search page
        browser.back()

    browser.quit()
    
    # return scraped data
    return {'news_title':news_title, 'news_para':news_paragraph,'feat_img':img_link,'weather':weather,'facts':table_string,'hemi_imgs':hemi_urls}
        
