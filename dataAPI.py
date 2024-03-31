import mongodb

department_list = ["Computer Science", "Electrical and Computer Engineering", "Life Sciences", "Mathematics"]
requested_majors = []
term = "24S"

mongodb.load_course_data(department_list, term)
mongodb.load_major_data(requested_majors)