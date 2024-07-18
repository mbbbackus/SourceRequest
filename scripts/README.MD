## Steps to reproduce/develop

To run sourceExtractor, just use python3. 

`python3 sourceExtractor.py "<URL>"`

If you get an error saying your SSL certificate failed verification, run the following command to install a new SSL certificate.

`open /Applications/Python\ 3.11/Install\ Certificates.command`

You can modify the file to be executable like so:

`chmod +x sourceExtractor.py`

And then you can run it like so instead:

`./sourceExtractor.py "<URL>"`

You can also pass in a flag called "Ignore Cycles" which tells the script to ignore any cycles in the graph, which is when a node links to itself. What this means is that the script will ignore any links that go to the same website being parsed. Make sure the flag comes before the URL like so:

`./sourceExtractor.py -ic "https://www.nytimes.com/live/2024/07/15/us/trump-documents-case-dismissed/33f56f13-9a48-5ae4-b15c-08b062ebb3bf?smid=url-share"`

We use the BeautifulSoup library, for which you can find a quickstart guide here:

https://beautiful-soup-4.readthedocs.io/en/latest/#quick-start

## Some scraping strategy I derived:
- Don't grab every url in the webpage. All the articles have tons of links all over the page, but the actual articles tend to get chunked into separate paragraph tags, within which the citation urls will be found. So, only grab the urls that are nested within a p tag
- It's easier to understand the purpose of the citation if you grab the whole sentence surrounding the link, not just the text that's highlighted. The whole paragraph is good too
- CNN and FOX love to cite their own website a bunch to maximize SEO, so removing citations that lead to links under the same domain name filters out a lot of noise
- Seems like some cruft is still getting through (career pages lol)
- If a paragraph has more than one link we gotta handle that separately... maybe

## Some food for thought:
- Some sources function as primary sources themselves for certain information, while citing other sources for other information. For example, the link to the philly enquirer about Trump's shooter is the official source that interviewed the classmate that called him republican, but a different source (AP NEWS) interviewed classmates that shared other facts - like that he wore hunting outfits to class
- Do we want to run the script on all the links that crop up too? Or should we apply like a cap of 5 hops...
    - We should do breadth first for this for sure, since each layer has exponentially more links to cover
- AI use cases:
    - Possibly for finding primary source information from other articles' claims
    - For checking if certain links are actually relevant (might be like using a boulder when you need a rock)
    - For compiling a breakdown of the facts
- We want to store stuff in the database
    - Cache articles so we don't have to parse them over and over
    - Store AI generated breakdowns, maybe?
- We probably want to automate the scraping of headline articles
    - Have a script running every day scraping top news sites, subreddits, other trending stuff?
    - Have a landing page with these latest stories?
- Security
    - We definitely don't want the user to just be able to post a URL that our script will automatically go to. That's such an easy way for them to inject malware. We probably will want a list of registered/known domains

## Example articles to test:

```
articles = [
    {
        "title": "Judge Aileen Cannon dismisses Trump classified documents case",
        "address": "https://www.kiro7.com/news/trending/judge-dismisses-trump-classified-documents-case/BAIFWZESSFFLXOG6WBQWPPQL5Q/"
    },
    {
        "title": "Why Thomas Matthew Crooks tried to assassinate Donald Trump is a mystery to investigators and his ex-classmates",
        "address": "https://www.inquirer.com/news/pennsylvania/thomas-matthew-crooks-trump-shooting-bethel-park-20240714.html"
    },
    {
        "title": "Biden and his campaign grapple with a delicate national moment",
        "address": "https://www.cnn.com/2024/07/14/politics/joe-biden-trump-campaign"
    },
    {
        "title": "Trump breaks silence on assassination attempt: 'I'm not supposed to be here'",
        "address": "https://www.foxnews.com/politics/trump-breaks-silence-assassination-attempt-im-not-supposed-here"
    }
]
```