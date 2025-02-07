import requests
from bs4 import BeautifulSoup
import yaml

def scrape_website(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Extract relevant data, e.g., paragraphs
    data = [p.get_text() for p in soup.find_all('p')]
    return data

def create_nlu_data(scraped_data):
    nlu_data = {
        "version": "3.1",
        "nlu": []
    }
    
    for text in scraped_data:
        nlu_data["nlu"].append({
            "intent": "inform",
            "examples": f"- {text}"
        })
    
    return nlu_data

def save_nlu_data(nlu_data, filepath):
    with open(filepath, 'w', encoding='utf-8') as file:
        yaml.dump(nlu_data, file, allow_unicode=True)

# Scrape data from the website
scraped_data = scrape_website('https://mark.haykalah.com')

# Create NLU data
nlu_data = create_nlu_data(scraped_data)

# Save NLU data to a file
save_nlu_data(nlu_data, 'data/nlu_scraped.yml')