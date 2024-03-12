from os import error
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
from os import error
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import json
import re
import requests
#Have a global dictionary that keeps track of all of the courses current in the database and their information
course_list = dict()
major_list = dict()
import json
import re
import requests
#Have a global dictionary that keeps track of all of the courses current in the database and their information
course_list = dict()
major_list = dict()
# Set up Chrome options for headless mode
chrome_options = Options() 
chrome_options = Options() 
chrome_options.add_argument("--headless")
chrome_options.add_argument('--log-level=3')


def get_abbrv_dict():
   url = "https://registrar.ucla.edu/faculty-staff/courses-and-programs/department-and-subject-area-codes"
   driver = webdriver.Chrome(options=chrome_options)
   driver.get(url)
   html = driver.page_source
   soup = BeautifulSoup(html, 'lxml')
   table = soup.find('table', class_="js-sortable").find_all('tr')
   abbrv_dict = dict()
   for entry in table:
       major_data = entry.find_all('td')
       try:
           course_name = major_data[2].text
           course_abbrv = major_data[3].text
           abbrv_dict[course_name] = course_abbrv


       except:
           pass                       
   return abbrv_dict


abbrv_dict = get_abbrv_dict()
class Major:
   def __init__(self, major_name, course_list):
       self.name = major_name
       self.courses = course_list
      
class Course:
   def __init__(self, id, abbrv='', title='', num='', lec=[], reqs=[], coreqs=[], page='', term=''):
       self.id = id
       self.course_abbrv = abbrv
       self.course_title = title
       self.cat_num = num
       self.lectures = lec
       self.prereqs = reqs
       self.coreqs  = coreqs
       self.course_page = page
       self.term = term
class lecture:
   def __init__(self, num = '1', title='', location='', time ='', days = '', instructors=[], status='', capacity='', waitlist='',units='', final_date='', final_time='', final_location=''):
       self.num = num
       self.title = title
       self.location = location
       self.time = time
       self.days = days
       self.instructors = instructors
       self.status = status
       self.capacity = capacity
       self.waitlist = waitlist
       self.units = units
       self.final_date = final_date
       self.final_time = final_time
       self.final_location = final_location 
class discussion():
   pass
#returns a list of all the courses offered in a term
def get_courses_offered(subject_abbrv, term):
    
  
   url = f"https://sa.ucla.edu/ro/ClassSearch/Public/Search/GetLevelSeparatedSearchData?input=%7B%22search_by%22%3A%22subject%22%2C%22term_cd%22%3A%22{term}%22%2C%22subj_area_cd%22%3A%22{subject_abbrv}%22%2C%22ses_grp_cd%22%3A%22%25%22%7D&level=2"


   html = requests.get(url).text
   soup = BeautifulSoup(html, 'lxml')
   json_data = soup.find('html').text
   courses = json.loads(json_data)
  
   #first item in tuple is course name second item is catalog number
   course_list = []
   # Process each course dictionary separately
   for course in courses:
       course_list.append(course['label'])
      


      
   return course_list


#function returns a tuple of all of the courses required for a major,
#multiple tuples in a list all fulfill the same major requirement,
#the last number in the list tells you how many courses from the list one must complete to meet requirement
#the first value of the tuple is the course title, the 2nd is the link to the course page


def load_major_reqs(major_name):
   parsed_major_name = major_name.lower().replace(" ", "")
   print("Processing:", major_name)
   url = f"https://catalog.registrar.ucla.edu/major/2023/{parsed_major_name}bs"
   driver = webdriver.Chrome(options=chrome_options)
   driver.get(url)
   visited_courses = dict()
   major_reqs = []
  
   html = driver.page_source
   soup = BeautifulSoup(html, 'lxml')
   containers = soup.find_all('div', class_='epj23730')
   if not containers:
       url = f"https://catalog.registrar.ucla.edu/major/2023/{parsed_major_name}ba"
       driver.get(url)
       html = driver.page_source
       soup = BeautifulSoup(html, 'lxml')
       containers = soup.find_all('div', class_='epj23730')
  
   if not containers:
       print("Major not found")
       return error




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
                           course_name = course.find('span', class_='relationshipName').text  # Extract the course name
                           if course_name not in visited_courses.keys():
                               visited_courses[course_name] = True
                               course_name = course_name.split('-')[0].strip()
                               series_group.append(course_name)  # Append the tuple to the series group list


                   # Print and append the series group only if it's not empty
                   if series_group:
                       course_num = len(series_group)
                       series_group.append(course_num)
                       course_options.append(series_group)
      
       else: 
           course_container = container.find('div', class_='e127f7tk4')
           for object in course_container:
              
               course_name = object.find("span", class_='relationshipName').text


               if "Select one course from:" in req_description:
                   if course_name not in visited_courses.keys():
                       visited_courses[course_name] = True
                       course_name = course_name.split('-')[0].strip()                     
                       course_options.append(course_name)
               else:
                   if course_name not in visited_courses.keys():
                       visited_courses[course_name] = True
                       course_name = course_name.split('-')[0].strip()                       
                       major_reqs.append(course_name)
          
      
       if "Select one course from:" in req_description:
           if course_options not in major_reqs:
               course_options.append(1)
               major_reqs.append(course_options)


       elif "one series" in req_description:
           if course_options not in major_reqs:
               course_options.append(1)
               major_reqs.append(course_options)
      
   major_node = Major(major_name, major_reqs)
   major_list[major_name] = major_node


def add_course_list(courses, dictionary):
  
   for object in courses:
       if type(object) is str:
           full_name = object[0]
           hash = full_name.split('-')[0].rstrip(' ')
           course_title = full_name.split('-')[1].lstrip(' ')
           node = Course(hash, course_title)
           dictionary[hash] = node
           
       else:
           if type(object) is list:
               #remove the integer from the list then process normally
               object.pop()
               for item in object:
                   if type(item) is str:
                       full_name = item
                       hash = full_name.split('-')[0].rstrip(' ')
                       course_title = full_name.split('-')[1].lstrip(' ')
                       node = Course(hash, course_title)
                       dictionary[hash] = node                       
                   elif type(item) is list:
                       #if entity is a series, then pop off the course count and then process
                       item.pop()
                       for pair in item:
                           full_name = pair
                           hash = full_name.split('-')[0].rstrip(' ')
                           course_title = full_name.split('-')[1].lstrip(' ')
                           node = Course(hash, course_title)
                           dictionary[hash] = node          
      
   return dictionary.keys()




def get_catalog_number(course_description):
   # Regular expression to match letters before the digits, the digits, and letters after the digits
   match = re.search(r'([A-Z]*)(\d+)([A-Z]*)', course_description)


   if match:
       prefix, number, suffix = match.groups()


       # Ensure the number part is 4 digits by padding with leading zeros
       number_part = number.zfill(4)


       # Rearrange the parts: number first, then prefix, then suffix, adding spaces as needed to make it 8 characters long
       if prefix:
           if len(prefix) == 1:
               prefix+=" "
           spacing = "".ljust(8-len(number_part)-len(suffix)-len(prefix), ' ')
           catalog_number = f"{number_part}{suffix}{spacing}{prefix}"


       else:
           catalog_number = f"{number_part}{suffix}".ljust(8, ' ')


       return catalog_number


   # Return None if the pattern does not match the course description
   return None




def generate_course_url(subject_code, catalog_num, term):
   # Parse the base URL to extract components
  
   base_url = "https://sa.ucla.edu/ro/public/soc/Results/GetCourseSummary?model=%7B%22Term%22%3A%2224W%22%2C%22SubjectAreaCode%22%3A%22COM+SCI%22%2C%22CatalogNumber%22%3A%220035L+++%22%2C%22IsRoot%22%3Atrue%2C%22SessionGroup%22%3A%22%25%22%2C%22ClassNumber%22%3A%22%25%22%2C%22SequenceNumber%22%3Anull%2C%22Path%22%3A%22COMSCI0035L%22%2C%22MultiListedClassFlag%22%3A%22n%22%2C%22Token%22%3A%22MDAzNUwgICBDT01TQ0kwMDM1TA%3D%3D%22%7D&FilterFlags=%7B%22enrollment_status%22%3A%22O%2CW%2CC%2CX%2CT%2CS%22%2C%22advanced%22%3A%22y%22%2C%22meet_days%22%3A%22M%2CT%2CW%2CR%2CF%22%2C%22start_time%22%3A%228%3A00+am%22%2C%22end_time%22%3A%228%3A00+pm%22%2C%22meet_locations%22%3Anull%2C%22meet_units%22%3Anull%2C%22instructor%22%3Anull%2C%22class_career%22%3Anull%2C%22impacted%22%3Anull%2C%22enrollment_restrictions%22%3Anull%2C%22enforced_requisites%22%3Anull%2C%22individual_studies%22%3Anull%2C%22summer_session%22%3Anull%7D&_=1709852472123"
   parsed_url = urlparse(base_url)
   query_components = parse_qs(parsed_url.query)


   # Extract the 'model' parameter and convert it from a JSON string to a dictionary
   model_param = json.loads(query_components['model'][0])
   # Update the dictionary with the new course details
   parsed_cat_num = get_catalog_number(catalog_num)
   path = (subject_code + parsed_cat_num).replace(' ', '')
   model_param['SubjectAreaCode'] = subject_code
   model_param['CatalogNumber'] = parsed_cat_num
   model_param['Term'] = term
   model_param['Path'] = path


   updated_model_param = json.dumps(model_param)


   # Update the 'model' parameter in the original query components
   query_components['model'] = [updated_model_param]


   # Re-encode the query parameters
   updated_query_string = urlencode(query_components, doseq=True)


   # Reconstruct the full URL with the updated query string
   new_url = urlunparse((
       parsed_url.scheme,
       parsed_url.netloc,
       parsed_url.path,
       parsed_url.params,
       updated_query_string,
       parsed_url.fragment
   ))


   return new_url




def wrap_html_body(body_content):


   html_template = """
<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Document</title>
</head>
<body>
   {body_content}
</body>
</html>
   """
   return html_template.format(body_content=body_content)




def get_reqs_and_final(course_page):
   url_base = "https://sa.ucla.edu/"
   url = url_base + course_page
   response = requests.get(url)
   response.encoding = 'utf-8'
   html = response.text
   pattern = r'<div id="webComponentWrapper">(.+?)<script'
   course_info = re.search(pattern, html, re.DOTALL).group(1)
   formatted_html = wrap_html_body(course_info)
   # Parse the HTML content
   soup = BeautifulSoup(formatted_html, 'lxml')
  
   req_container = soup.find('div', id='course_requisites')
   requisites = req_container.find('tbody')
   course_reqs = []
   course_coreqs = []
   alt_courses = []
  
   #process final information
   final_info = soup.find('div', id='final_exam_info').find('tbody').find_all('td')
   final_date = re.search('>\\s*(.+?)\\s*<', str(final_info[0])).group(1)
   final_time = re.search('>\\s*(.+?)\\s*<', str(final_info[2])).group(1)
   final_location = re.search('>\\s*(.+?)\\s*<', str(final_info[3])).group(1)
  
   try:
       tr_container = requisites.find_all('tr', class_="course_requisites scrollable-collapse")
   except:
       #if there are no prereqs/coreqs, return empty containers
       return [], [], final_date, final_time, final_location
  
   or_flag = False
   paren_flag = False
   for entry in tr_container:
       td_container = entry.find_all('td')
       button = td_container[0].button
       match = re.search('>\\s*(.+?)\\s*<', str(button))
       course_title = match.group(1) 
       if " and" in course_title[-4:]:
           course_title = course_title[:-4]        
      
       if course_title.startswith('('):
           paren_flag = True
           course_title = course_title.strip('(').strip()       
      
      
       elif course_title.endswith(" or"):
           or_flag = True
           course_title = course_title.strip('(').strip()
          
       if paren_flag:
           if course_title.endswith(")"):
               course_title = course_title.strip(')')
               alt_courses.append(course_title.strip(')').strip('('))
               paren_flag = False
               if "Yes" in td_container[3]:
                   course_coreqs.append(alt_courses)
               else:
                   course_reqs.append(alt_courses)
               alt_courses = []
           else:
               course_title = course_title.strip(" or")
               alt_courses.append(course_title.strip(')').strip('('))
           continue
      
       elif or_flag:
           if not course_title.endswith(" or"):
               course_title = course_title.strip(')').strip('(')
               alt_courses.append(course_title)
               or_flag = False
               if "Yes" in td_container[3]:
                   course_coreqs.append(alt_courses)
               else:
                   course_reqs.append(alt_courses)
               alt_courses = []
           else:
               course_title = course_title.strip(" or")
               alt_courses.append(course_title.strip('(').strip(')'))
           continue               
      
      
       else:
           if "Yes" in td_container[3]:
               course_coreqs.append(course_title.strip('(').strip(')'))
           else:
               course_reqs.append(course_title.strip('(').strip(')'))
  
   #translate each course to their id
   final_course_reqs = []
   final_course_coreqs = []
   for element in course_reqs:
       if type(element) is str:
           department = element.rsplit(' ', 1)[0]
           num = element.rsplit(' ', 1)[1]
           abbrv = abbrv_dict.get(department)
           final_course_reqs.append(abbrv + " " + num)
       if type(element) is list:
           new_list = []
           for course in element:
               department = course.rsplit(' ', 1)[0]
               num = course.rsplit(' ', 1)[1]
               abbrv = abbrv_dict.get(department)
               new_list.append(abbrv + " " + num)
          
           final_course_reqs.append(new_list)


   for element in course_coreqs:
       if type(element) is str:
           department = element.rsplit(' ', 1)[0]
           num = element.rsplit(' ', 1)[1]
           abbrv = abbrv_dict.get(department)
           final_course_coreqs.append(abbrv + " " + num)
       if type(element) is list:
           new_list = []
           for course in element:
               department = course.rsplit(' ', 1)[0]
               num = course.rsplit(' ', 1)[1]
               abbrv = abbrv_dict.get(department)
               new_list.append(abbrv + " " + num)
          
           final_course_coreqs.append(new_list)               


   return final_course_reqs, final_course_coreqs, final_date, final_time, final_location




def load_data(subject_name, term):
  
   if (abbrv_dict.get(subject_name, '')):
       abbrv = abbrv_dict.get(subject_name)
   else:
       print("Please Enter A Valid Major Name:", subject_name, "Was Not Found")
       return error
  
   subject_abbrv = abbrv.translate(str.maketrans(' ', '+'))  
  
   course_list = get_courses_offered(subject_abbrv, term)
   for course in course_list:
       print("Processing:", course)
       create_course_node(abbrv, course, term)


      
  
def create_course_node(subject_abbrv, course_name, term):
   url = generate_course_url(subject_abbrv, course_name, term)
   html = requests.get(url).text
   soup = BeautifulSoup(html, 'lxml')
   sections = soup.find_all('div', class_='row-fluid data_row primary-row class-info class-not-checked')
   if not sections:
       print("Course Not Found")
       return error
   section_list = []
  
   course_page = sections[0].find('a').get('href', '')
   prereqs = []
   coreqs = []
   final_date = ''
   final_time = ''
   final_location = ''
   prereqs, coreqs, final_date, final_time, final_location = get_reqs_and_final(course_page)


   for section in sections:
       #get all section information
       section_num = section.find('a').text
       course_page = section.find('a').get('href', '')
       section_title = section.find('div', class_="enrollColumn").label.text.split('-')[1].strip().rsplit(' ', 2)[0]
       enroll_info = section.find('div', class_='statusColumn').p.get_text(separator='\n')
       section_location = section.find('div', class_='locationColumn hide-small').p.text.strip()
       section_time = section.find('div', class_='timeColumn').find_all("p")[1].text
       section_days = section.find('div', class_='timeColumn').find_all("p")[0].text
       instructors = section.find('div', class_='instructorColumn hide-small').p.get_text(separator='\n').split('\n')
       section_status = enroll_info.split('\n')[0].strip()
       if final_date != "None listed":
           prereqs, coreqs, final_date, final_time, final_location = get_reqs_and_final(course_page)
      
       if enroll_info.count('\n') > 1:
           if "Cancelled" in section_status:
               continue
           if "Closed by Dept" in section_status:
               section_capacity = enroll_info.split('\n')[2]
           else:
               section_capacity = enroll_info.split('\n')[1]
       else:
           section_capacity = ''
       section_waitlist = section.find('div', class_='waitlistColumn').p.text
       section_units = section.find('div', class_='unitsColumn').p.text
      
       lec_node = lecture(section_num, section_title, section_location, section_time, section_days, instructors, section_status, section_capacity, section_waitlist, section_units, final_date, final_time, final_location)
       section_list.append(lec_node)




   course_num = course_name.split('-')[0].strip()
   course_id = (subject_abbrv + ' ' + course_num)
   course_node = Course(course_id, subject_abbrv, course_name, course_num, section_list, prereqs, coreqs, ("https://sa.ucla.edu" + course_page), term)
   course_list[course_id] = course_node




def set_reqs_to_nodes():
   new_courses = []
   new_nodes = []
   for node in course_list.values():


       for element in node.prereqs:
           if type(element) is str:
               new_node = course_list.get(element, "")
               if not new_node:
                   course_subject = element.rsplit(' ', 1)[0]
                   cat_num = element.rsplit(' ', 1)[1]
                   course_node = Course(element, course_subject, "", cat_num)
                   new_nodes.append(course_node)
                   new_courses.append(element)
                  
           elif type(element) is list:
               new_list = []
               for course in element:
                   new_node = course_list.get(course, "")
                   if not new_node:
                       course_subject = course.rsplit(' ', 1)[0]
                       cat_num = course.rsplit(' ', 1)[1]   
                       course_node = Course(course, course_subject, "", cat_num)
                       new_list.append(course_node)
                       new_courses.append(course)
                       new_nodes.append(course_node)
                   else:
                       new_list.append(new_node)
              
       for element in node.coreqs:
           if type(element) is str:
               new_node = course_list.get(element, "")
               if not new_node:
                   course_subject = element.rsplit(' ', 1)[0]
                   cat_num = element.rsplit(' ', 1)[1]                   
                   course_node = Course(element, course_subject, "", cat_num)
                   new_nodes.append(course_node)
                   new_courses.append(element)


           elif type(element) is list:
               for course in element:
                   new_node = course_list.get(course, "")
                   if not new_node:
                       course_subject = course.rsplit(' ', 1)[0]
                       cat_num = course.rsplit(' ', 1)[1]                        
                       course_node = Course(course, course_subject, "", cat_num)
                       new_courses.append(course)
                       new_nodes.append(course_node)


  
  
   for i in range(len(new_courses)):
       course_list[new_courses[i]] = new_nodes[i]


#testing


#prints everything
def print_all():
   for entry in course_list.items():
       print(entry[0])
       print("Subject:", entry[1].course_abbrv)
       print("Page:", entry[1].course_page)
       print("prerequisites:", end=' ')
       for item in entry[1].prereqs:
           if type(item) is list:
               temp = []
               for object in item:
                   temp.append(object)
               print(temp, end=' ')
           else:
               print(item, end=", ")
       print()
      
       print("corequisites:", end=' ')
      
       for item in entry[1].coreqs:
           if type(item) is list:
               temp = []
               for object in item:
                   temp.append(object)
               print(temp, end=' ')
           else:
               print(item, end=', ')
       print()
      
       print("Lectures:")
      
       for item in entry[1].lectures:
           print("Lecture Number:", item.num)  # Displays the unique identifier or number of the lecture.
           print("Lecture Title:", item.title)  # Shows the name or title of the lecture.
           print("Location:", item.location)  # Indicates where the lecture is held, such as a room number or online platform.
           print("Time:", item.time)  # Shows the time at which the lecture is scheduled to start and end.
           print("Days:", item.days)  # Lists the days of the week on which the lecture occurs.
           print("Instructors:", ', '.join(item.instructors))  # Displays the names of the instructors or professors conducting the lecture. Assumes 'item.instructors' is a list; joins the list items into a string separated by commas.
           print("Status:", item.status)  # Indicates the current enrollment status of the lecture, such as "Open", "Full", or "Waitlisted".
           print("Capacity:", item.capacity)  # Shows the maximum number of students that can enroll in the lecture.
           print("Waitlist:", item.waitlist)  # Displays the number of students currently on the waitlist for the lecture.
           print("Units:", item.units)  # Indicates the number of credit units the lecture is worth.
           print("Final Date:", item.final_date)  # Shows the maximum number of students that can enroll in the lecture.
           print("Final Time:", item.final_time)  # Displays the number of students currently on the waitlist for the lecture.
           print("Final Location:", item.final_location)  # Indicates the number of credit units the lecture is worth.




       print('---------------------')


def load_courses():
   #for each class you want to load, call load_data()
   # load_data("Electrical and Computer Engineering", "24S")




   # for course in courses:
   #     print("Processing:", course)
       # create_course_node("PHYSICS", course, "24S")
   load_data("Computer Science", "24S")
   load_data("Mathematics", "24S")
   load_data('Physics', '24S')
   load_data("Physics", "24S")
   load_data("Electrical and Computer Engineering", "24S")
   load_data("Program in Computing", "24S")
   set_reqs_to_nodes()
   return course_list


def load_majors():
   load_major_reqs("Computer Science")
   load_major_reqs("Mathematics")
   load_major_reqs("Physics")
   load_major_reqs("ComputerEngineering")


   return major_list



