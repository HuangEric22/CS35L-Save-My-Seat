from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import Course_Scraper
import certifi
uri = "mongodb+srv://huangeric22:a@cluster0.1up29cj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'), tlsCAFile=certifi.where())


# Send a ping to confirm a successful connection
try:
   client.admin.command('ping')
   print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
   print(e)


def insert_course(course):
   db = client['test']
   collection = db['Courses'] 
   print("Inserting:", course.id)
   course_dict = course.__dict__
   course_dict['lectures'] = [lec.__dict__ for lec in course_dict['lectures']]


   if course_dict['lectures']:
       result = collection.replace_one({'id': course_dict['id']}, course_dict, upsert=True)


       if result.matched_count > 0:
           print(f"Replaced the document with id {course_dict['id']}.")
       elif result.upserted_id is not None:
           print(f"Inserted {course_dict['id']} with id {result.upserted_id}.")
   else:
       course_query = collection.find_one({'id': course_dict['id']})
       if course_query is None:
           # Object does not exist, so insert the new one
           result = collection.insert_one(course_dict)
           print(f'Inserted {course_dict['id']} with id: {result.inserted_id}')
       else:
           # Object already exists, do nothing
           print(course_dict['id'], 'already exists, no new insertion.')       


  
  
   print('------------------')


def insert_major(major):
   db = client['test']
   collection = db['Major_Reqs']
   print("Inserting:", major.name)
   major_dict = major.__dict__
   result = collection.replace_one({'name': major_dict['name']}, major_dict, upsert=True)
   if result.matched_count > 0:
       print(f"Replaced the document with id {major_dict['name']}.")
   elif result.upserted_id is not None:
       print(f"Inserted a new document with id {major_dict['name']}") 
  
def insert_abbreviations():
   db = client['test']
   collection = db['Abbreviations']
   abbrv_dict = Course_Scraper.get_abbrv_dict()


   result = collection.replace_one({'name': "Course_Dict"}, abbrv_dict, upsert=True)
   if result.matched_count > 0:
       print("Replaced Abbreviation Dictionary")
   else:
       print("Inserted Abbreviation Dictionary")
 
  
course_list = Course_Scraper.load_courses()
major_list = Course_Scraper.load_majors()


for course in course_list.values():
    insert_course(course)

for major in major_list.values():
    insert_major(major)
  
insert_abbreviations()

