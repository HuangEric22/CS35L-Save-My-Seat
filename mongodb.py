from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import Course_Scraper

uri = "mongodb+srv://huangeric22:a@cluster0.1up29cj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

def insert_course(course):
    db = client['Class_Data']
    collection = db['Courses']  
    print("Inserting:", course.id)
    course_dict = course.__dict__
    course_dict['lectures'] = [lec.__dict__ for lec in course_dict['lectures']]
    print(course_dict['prereqs'])
    print(course_dict['coreqs'])
    result = collection.replace_one({'id': course_dict['id']}, course_dict, upsert=True)

    if result.matched_count > 0:
        print(f"Replaced the document with id {course_dict['id']}.")
    elif result.upserted_id is not None:
        print(f"Inserted a new document with id {result.upserted_id}.")
    
    print('------------------')

def insert_major(major):
    db = client['Major_Requirements']
    collection = db['Course_List']
    print("Inserting:", major.name)
    major_dict = major.__dict__
    result = collection.replace_one({'name': major_dict['name']}, major_dict, upsert=True)
    if result.matched_count > 0:
        print(f"Replaced the document with id {major_dict['name']}.")
    elif result.upserted_id is not None:
        print(f"Inserted a new document with id {result.upserted_id}.")    
    
    
# course_list = Course_Scraper.load_courses()
major_list = Course_Scraper.load_majors()
# for course in course_list.values():
#     insert_course(course)
for major in major_list.values():
    insert_major(major)
    
