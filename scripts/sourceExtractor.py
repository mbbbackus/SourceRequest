#!/usr/bin/env python3 

import urllib.request
from bs4 import BeautifulSoup
import sys

if len(sys.argv) <= 1:
    sys.exit("A URL must be passed into the script as a parameter")

def getSources(chosenURL, ignore_cycles):

    # Retrieve HTML from website
    # with urllib.request.urlopen(chosenURL) as f:
    #     rawFile = f.read().decode("utf-8")

    request = urllib.request.Request(chosenURL, headers={'User-Agent' : "Magic Browser"})
    with urllib.request.urlopen(request) as f:
        rawFile = f.read().decode()

    # extract domain name
    parsed_uri = urllib.request.urlparse(chosenURL)
    domainName = parsed_uri.hostname.replace('www.', '')

    # Load bsoup and print header
    articleSoup = BeautifulSoup(rawFile, 'html.parser')

    print('')
    print('--------------------------------------')
    print(articleSoup.title.get_text())
    print('--------------------------------------')

    # find only links that are wrapped within a p tag (that's how you remove the cruft)
    # also extract the sentence containing the link
    paragraphs = articleSoup.find_all('p')
    links = []
    for paragraph in paragraphs:
        links_in_p = paragraph.find_all('a')
        p_text = paragraph.get_text()
        sentences_in_p = p_text.split('. ')
        for link in links_in_p:
            sentence = p_text # init to full paragraph text then whittle down to precise sentence
            link_text = link.get_text()
            link_url = link.get('href')

            if (not link_text): # ignore links with no text
                continue

            if (not link_url): # ignore links without addresses
                continue

            link_text = link_text.strip()
            link_url = link_url.strip()

            if (link_text == ''):
                continue
            if ("https://" not in link_url): # ignore app router links
                continue
            if (ignore_cycles and domainName in link_url): # ignore links to same website 
                continue

            for sentence_being_checked in sentences_in_p:
                if link_text in sentence_being_checked:
                    sentence = sentence_being_checked

            links.append({
                "paragraph": paragraph.get_text(),
                "sentence": sentence,
                "text": link_text,
                "url": link_url,

            })

    # check for tweets 
    iframes = articleSoup.find_all('iframe')
    for iframe in iframes:
        if "twitter" in iframe.get("id"):
            links.append({
                "paragraph": "twitter embedding",
                "sentence": "twitter embedding",
                "text": "twitter embedding",
                "url": iframe.get("src")
            })


    sources = []

    # print out the links that matter
    for l in links:
        sources.append(l["url"])
        print(l["sentence"], '    -    ', l["url"])
    
    return sources


# run script
ignore_cycles = ("-ic" in sys.argv)
sources = getSources(sys.argv[-1], ignore_cycles)

# TODO determine how you want to traverse the sources from here
# for source in sources:
#     getSources(source)