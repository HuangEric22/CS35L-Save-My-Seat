from os import error
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import json
import re

# Set up Chrome options for headless mode
chrome_options = Options()
chrome_options.add_argument("--window-size=1920,1080")
chrome_options.add_argument("--headless")
chrome_options.add_argument('--log-level=3')


#returns a list of all the courses offered in a term
def get_courses_offered(major_name, term):
    
    if get_abbrv(major_name):
        abbrv = get_abbrv(major_name)
    else:
        print("Please Enter A Valid Major Name")
        return error
    major_abbrv = abbrv.translate(str.maketrans(' ', '+'))    
    
    url = f"https://sa.ucla.edu/ro/ClassSearch/Public/Search/GetLevelSeparatedSearchData?input=%7B%22search_by%22%3A%22subject%22%2C%22term_cd%22%3A%22{term}%22%2C%22subj_area_cd%22%3A%22{major_abbrv}%22%2C%22ses_grp_cd%22%3A%22%25%22%7D&level=2"
    driver = webdriver.Chrome(options=chrome_options)
    driver.get(url)

    html = driver.page_source
    soup = BeautifulSoup(html, 'lxml')
    json_data = soup.find('html').text
    courses = json.loads(json_data)
    
    driver.close()
    #first item in tuple is course name second item is catalog number
    course_list = []
    # Process each course dictionary separately
    for course in courses:
        course_list.append(course['label'])
        
    # for course in course_list:
    #     print(course)
        
    return course_list

#function returns a tuple of all of the courses required for a major, 
#multiple tuples in a list all fulfill the same major requirement,
#the last number in the list tells you how many courses from the list one must complete to meet requirement
#the first value of the tuple is the course title, the 2nd is the link to the course page
def get_major_reqs(major_name):
    
    url = f"https://catalog.registrar.ucla.edu/major/2023/{major_name}bs"
    driver = webdriver.Chrome(options=chrome_options)
    driver.get(url)
    
    major_reqs = []

    html = driver.page_source
    soup = BeautifulSoup(html, 'lxml')
    containers = soup.find_all('div', class_='e127f7tk8')
    
    for container in containers:

        req_description = container.find('div', class_='e127f7tk5').text
        course_options = []

        course_container = container.find('div', class_='e127f7tk4')
        for object in course_container:
            
            course_page = object['href']
            course_name = object.find("span", class_='relationshipName').text
            name_page_pair = (course_name, course_page)

            if "Select one course from:" in req_description:
                course_options.append(name_page_pair)
            else:
                major_reqs.append(name_page_pair)
            
        if "Select one course from:" in req_description:
            if course_options not in major_reqs:
                course_options.append(1)
                major_reqs.append(course_options)
        
    driver.close()    
    return major_reqs

    
def get_abbrv(major_name):
    url = "https://registrar.ucla.edu/faculty-staff/courses-and-programs/department-and-subject-area-codes"
    driver = webdriver.Chrome(options=chrome_options)
    driver.get(url)
    html = driver.page_source
    soup = BeautifulSoup(html, 'lxml')
    table = soup.find('table', class_="js-sortable").find_all('tr')
    get_abbrv = dict()
    for entry in table:
        major_data = entry.find_all('td') 
        try:
            course_name = major_data[2].text
            course_abbrv = major_data[3].text
            get_abbrv[course_name] = course_abbrv

        except:
            pass                        
    return get_abbrv.get(major_name, "")

import re

def extract_prerequisites(text):
    # Updated pattern to include 'Requisites:' and 'Corequisites:' in the capture
    # and to capture the entire phrase starting with these keywords.
    pattern = re.compile(
        r'((?:Requisite|Enforced requisite|Enforced corequisite|Requisites|Corequisites): (.*?))(?:\.|$| Not| P/NP| Letter)',
        re.IGNORECASE | re.DOTALL)

    # Find all matches in the text
    matches = pattern.findall(text)

    # Each match is a tuple, where the first element contains the full phrase we're interested in
    prerequisites = "; ".join(match[0] for match in matches).strip()

    return prerequisites

# Example course descriptions
course_descriptions = [
    # Add your course descriptions here
]

# Process each course description
for description in course_descriptions:
    prerequisites = extract_prerequisites(description)
    print("Prerequisites:", prerequisites if prerequisites else "None")
    
#returns a tuple of all of the courses for a major and their prerequisites

#todo: parse the prereq string so that you get call of the courses and the major abbreviation of said course 
def get_course_reqs(name_page_pair):
    course_list = []
    url_list = []
    prereqs = []
    course_req_pair = []
    driver = webdriver.Chrome(options=chrome_options)
    #add all of the urls we need to scrape into a list
    for item in name_page_pair:
        if type(item) is tuple:
            course_list.append(item[0])
            url = f"https://catalog.registrar.ucla.edu{item[1]}"
            url_list.append(url)
             
        else:
            if type(item) is list:
                #remove the integer from the list then process normally
                item.pop()
                for pair in item:
                    course_list.append(pair[0])
                    url = f"https://catalog.registrar.ucla.edu{pair[1]}"
                    url_list.append(url)
    
    for url in url_list:
        driver.get(url)
        soup = BeautifulSoup(driver.page_source, 'lxml')
        course_description = soup.find('div', class_='readmore-content-wrapper').text
        parsed_str = extract_prerequisites(course_description)
        prereqs.append(parsed_str)

    for i in range(len(course_list)):
        new_pair = [course_list[i], [prereqs[i]]]
        course_req_pair.append(new_pair)
    print(course_req_pair)
    return course_req_pair
        
name_page_pair = get_major_reqs("computerscience")
get_course_reqs(name_page_pair)

# for major in get_major_reqs("computerscience"):
#     print(major, end = ' ') 
#     print(type(major))

# for course in get_courses_offered("Computer Science", '24s'):
#     print(course)
    
# print(get_courses_offered("Greek"))
# print(get_courses_offered())

