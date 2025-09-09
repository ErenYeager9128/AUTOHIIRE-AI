# src/web_scraper.py

import requests
from bs4 import BeautifulSoup
import logging
from typing import List, Dict
from urllib.parse import quote

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
}

def scrape_linkedin_jobs(job_title: str, location: str, work_model: str = "", experience_level: str = "") -> List[Dict]:
    """Scrapes job listings from LinkedIn using filters."""
    job_title_formatted = quote(job_title)
    location_formatted = quote(location)
    url = f"https://www.linkedin.com/jobs/search?keywords={job_title_formatted}&location={location_formatted}"

    # Add filters
    if "remote" in work_model.lower():
        url += "&f_WT=2"   # Work type = Remote
    elif "hybrid" in work_model.lower():
        url += "&f_WT=3"   # Work type = Hybrid

    if "intern" in experience_level.lower():
        url += "&f_E=1"    # Internship
    elif "entry" in experience_level.lower():
        url += "&f_E=2"    # Entry level

    logging.info(f"Scraping LinkedIn with URL: {url}")

    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        job_cards = soup.find_all('div', class_='base-card')

        jobs_list = []
        for card in job_cards[:15]:  # limit to 15 jobs
            title_tag = card.find('h3', class_='base-search-card__title')
            company_tag = card.find('h4', class_='base-search-card__subtitle')
            location_tag = card.find('span', class_='job-search-card__location')
            link_tag = card.find('a', class_='base-card__full-link')

            if all([title_tag, company_tag, location_tag, link_tag]):
                jobs_list.append({
                    "title": title_tag.get_text(strip=True),
                    "company": company_tag.get_text(strip=True),
                    "location": location_tag.get_text(strip=True),
                    "link": link_tag['href'],
                    "source": "LinkedIn"
                })

        logging.info(f"Successfully scraped {len(jobs_list)} jobs from LinkedIn.")
        return jobs_list

    except Exception as e:
        logging.error(f"Failed to scrape LinkedIn: {e}")
        return []
