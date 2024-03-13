import mongodb

department_list = ["Mechanical and Aerospace Engineering", "Molecular, Cell, and Developmental Biology"]
requested_majors = []
term = "24S"

mongodb.load_course_data(department_list, term)
mongodb.load_major_data(requested_majors)