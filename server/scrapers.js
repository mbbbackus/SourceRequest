import axios from 'axios';
import { parse } from 'node-html-parser';

const getSources = async (url, ignoreCycles) => {
    const sources = [];
    let title = ''
    await axios.get(url).then((response) => {
        const root = parse(response.data);
        const domainName = (new URL(url)).hostname;
        const paragraphs = root.querySelectorAll('p');
        title = root.querySelector('title').text;
    
        const links = [];
        paragraphs.forEach(p => {
            const paragraph = p.text.trim();
            const sentences = paragraph.split('. ');
            const anchors = p.querySelectorAll('a');
            for (let a of anchors) {
                let sentence = paragraph;
                const link_text = a.text?.trim();
                const link_url = a.getAttribute('href');
                if (!link_text || !link_url) { // skip blank anchors
                    continue;
                }
                if (!link_url.includes('https://')) { // skip internal routes
                    continue;
                }
                if (ignoreCycles && link_url.includes(domainName)) { // skip links to same site
                    continue;
                }

                for (let s of sentences) {
                    if (s.includes(link_text)) {
                        sentence = s.trim();
                    }
                }

                links.push({
                    sentence,
                    link_text,
                    url: a.getAttribute('href')
                })
            }
        })
        for (let link of links) {
            sources.push(link)
        }
    })
    return {title, sources};
}

export {getSources};