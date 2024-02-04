from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

subject_name = "Computer+Science"
subject_abbrv = "COM+SCI"
term = "24W"
URL = f"https://sa.ucla.edu/ro/public/soc/Results?SubjectAreaName={subject_name}+({subject_abbrv})&t={term}&sBy=subject&subj={subject_abbrv}&catlg=&cls_no=&undefined=Go&btnIsInIndex=btn_inIndex"

# Set up Chrome options for headless mode
chrome_options = Options()
chrome_options.add_argument("--headless")

# Use a webdriver to open the page in headless mode
driver = webdriver.Chrome(options=chrome_options)
driver.get(URL)

html = driver.page_source

driver.quit()

soup = BeautifulSoup(html, 'lxml')

class_list = []
data = soup.find_all('div', class_='row-fluid class-title')

for classes in data:
    class_button = classes.find('h3').find('button')
    soup_2 = BeautifulSoup(f"{class_button}", "lxml")
    class_list.append(soup_2.button.text)

print(class_list)