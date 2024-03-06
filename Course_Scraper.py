from os import error
from pydoc import visiblename
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import json
import re

# Set up Chrome options for headless mode
chrome_options = Options()  
chrome_options.add_argument("--headless")
chrome_options.add_argument('--log-level=3')

class Course:
    def __init__(self, cat_hash, course_title):
        self.course_title = course_title
        self.cat_hash = cat_hash
        self.prereqs = set()
        self.coreqs  = set()
        

    
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
    visited_courses = dict()
    major_reqs = []

    html = driver.page_source
    soup = BeautifulSoup(html, 'lxml')
    containers = soup.find_all('div', class_='epj23730')
    
    for container in containers:

        course_options = []

        try:
            req_description = container.find('div', class_='e127f7tk5').text
        except:
            continue
        
        if "one series" in req_description:
            course_container = container.find_all('div', class_='e127f7tk8')  # Find all relevant containers for course series
            for obj in course_container:  # Iterate over each course container found
                if int(obj.get('data-level', 0)) == 3:  # Check if the data-level attribute is 3
                    series_group = []  # Initialize an empty list for each series group

                    course_group = obj.find('div', class_='e127f7tk4')  # Find the course group within the object
                    if course_group:
                        courses = course_group.find_all('a', class_='e127f7tk3')  # Find all course links within the course group
                        
                        for course in courses:  # Iterate over each course link found
                            course_page = course['href']  # Extract the href attribute as the course page URL
                            course_name = course.find('span', class_='relationshipName').text  # Extract the course name
                            if course_name not in visited_courses.keys():
                                visited_courses[course_name] = course_page
                                name_page_pair = (course_name, course_page)  # Create a tuple of course name and page URL
                                series_group.append(name_page_pair)  # Append the tuple to the series group list

                    # Print and append the series group only if it's not empty
                    if series_group:
                        course_num = len(series_group)
                        series_group.append(course_num)
                        course_options.append(series_group)
        
        else:  
            course_container = container.find('div', class_='e127f7tk4')
            for object in course_container:
                
                course_page = object['href']
                course_name = object.find("span", class_='relationshipName').text
                name_page_pair = (course_name, course_page)

                if "Select one course from:" in req_description:
                    if course_name not in visited_courses.keys():
                        visited_courses[course_name] = course_page
                        course_options.append(name_page_pair)
                else:
                    if course_name not in visited_courses.keys():
                        visited_courses[course_name] = course_page
                        major_reqs.append(name_page_pair)
            
        
        if "Select one course from:" in req_description:
            if course_options not in major_reqs:
                course_options.append(1)
                major_reqs.append(course_options)

        elif "one series" in req_description:
            if course_options not in major_reqs:
                course_options.append(1)
                major_reqs.append(course_options)
        

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

    return str(prerequisites)

def get_course_reqs(name_page_pair):
    course_list = []
    url_list = []
    prereqs = []
    course_req_pair = []
    driver = webdriver.Chrome(options=chrome_options)
    #add all of the urls we need to scrape into a list
    for object in name_page_pair:
        if type(object) is tuple:
            course_list.append(object[0])
            url = f"https://catalog.registrar.ucla.edu{object[1]}"
            url_list.append(url)
             
        else:
            if type(object) is list:
                #remove the integer from the list then process normally
                object.pop()
                for item in object:
                    if type(item) is tuple:
                        course_list.append(item[0])
                        url = f"https://catalog.registrar.ucla.edu{item[1]}"
                        url_list.append(url)
                    elif type(item) is list:
                        #if entity is a series, then pop off the course count and then process
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
        new_pair = [course_list[i], prereqs[i]]
        course_req_pair.append(new_pair)

    return course_req_pair

def hash_name_pair(name_page_pair):
    hash_to_course = dict()
       
    for object in name_page_pair:
        if type(object) is tuple:
            full_name = object[0]
            hash = full_name.split('-')[0].rstrip(' ')
            course_title = full_name.split('-')[1].lstrip(' ')
            node = Course(hash, course_title)
            hash_to_course[hash] = node
             
        else:
            if type(object) is list:
                #remove the integer from the list then process normally
                object.pop()
                for item in object:
                    if type(item) is tuple:
                        full_name = item[0]
                        hash = full_name.split('-')[0].rstrip(' ')
                        course_title = full_name.split('-')[1].lstrip(' ')
                        node = Course(hash, course_title)
                        hash_to_course[hash] = node                        
                    elif type(item) is list:
                        #if entity is a series, then pop off the course count and then process
                        item.pop()
                        for pair in item:
                            full_name = pair[0]
                            hash = full_name.split('-')[0].rstrip(' ')
                            course_title = full_name.split('-')[1].lstrip(' ')
                            node = Course(hash, course_title)
                            hash_to_course[hash] = node           
        
    return hash_to_course

# def parse_req_pair(course_req_pair):
#     parsed_reqs = []

#     pass

name_page_pair = get_major_reqs("computerengineering")
# for entry in name_page_pair:
#     print(entry)
    
# # print('----------------')
# print('------------')


# course_map = hash_name_pair(name_page_pair)
    
# for key in course_map.keys():
#     print(course_map[key].cat_hash)
#     print(course_map[key].course_title)
#     print('------------------------------')

def process_courses_final(courses):
    processed_courses = []
    prev_dept_prefix = ""

    for course in courses:
                   
        course_name, details = course
        
        department = " ".join(course_name.split(' - ')[0].split()[:-1])  # Extract the department from the course name

        # Initialize lists to hold prerequisites and corequisites
        prerequisites, corequisites = [], []

        # Split the details to separate prerequisites and corequisites
        details_parts = re.split(r';|\.|,', details)
        
        for part in details_parts:
            # Check if the part describes prerequisites or corequisites
            is_corequisite = 'corequisite' in part.lower()
            target_list = corequisites if is_corequisite else prerequisites
            
            # Find all course numbers in this part
            req_matches = re.findall(r'((\b\w+\b)?\s*\d+\w*)', part)
            
            # Prefix department if no department is specified in the requisite and format accordingly
            for match, dept_prefix in req_matches:
                match = match.strip()
                            
                if dept_prefix and dept_prefix not in ['course', 'courses', 'Mathematics', '', 'Science']:  # Use specified department if recognized  
                    if dept_prefix == "or" or dept_prefix == "and":
                        dept_prefix = prev_dept_prefix
                    if dept_prefix in ['course', 'courses', 'Mathematics', 'or', 'and']:
                        dept_prefix = department
                    target_list.append(f'{dept_prefix} {match.split()[-1]}')
                elif dept_prefix == 'Mathematics':  # Special case for 'Mathematics'
                    target_list.append(f'MATH {match.split()[-1]}')
                elif dept_prefix == 'Science':
                    target_list.append(f'COM SCI {match.split()[-1]}')
                elif dept_prefix == '':
                    if prev_dept_prefix in ['course', 'courses', '', 'or', 'and']:
                        target_list.append(f'{department} {match.split()[-1]}')
                    else:
                        if prev_dept_prefix == "Mathematics":
                            target_list.append(f'MATH {match.split()[-1]}')
                        else:
                            target_list.append(f'{prev_dept_prefix} {match.split()[-1]}')            
                else:  # Assume same department if no recognized department or prefix 'course' is found
                    target_list.append(f'{department} {match.split()[-1]}')
                
                prev_dept_prefix = dept_prefix
        # Construct the course details list and add it to the processed courses list
        processed_course = [course_name.split(' - ')[0], prerequisites, corequisites]
        processed_courses.append(processed_course)

    return processed_courses

course_req = get_course_reqs(name_page_pair)
print('---------------------------')
for item in process_courses_final(course_req):
    print(item)


# # Rerun the processing with the final function
