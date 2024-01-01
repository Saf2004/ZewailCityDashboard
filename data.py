import pandas as pd
import random
import plotly.express as px
from flask import jsonify


# Function to generate student data
import random
import pandas as pd
def generate_student_data():
    students_df = pd.DataFrame(
        columns=["student_id", "student_major", "student_concentration", "student_age", "student_gender",
                 "student_name", "student_batch",
                                 "student_gpa", "completed_credits", "required_credits", "number_of_replaces","max_credits/semester"])

    majors = ["Computer Science", "Engineering", "Mathematics", "Science"]
    concentrations = ["Data Science", "Information Technology", "Software Engineering"]
    male_names = ['Ahmed', 'Mohamed', 'Mahmoud', 'Moustafa', 'Yehia', 'Khalid', 'Youssef', 'Tamer', 'Naser',
                  'Abdelrahman']
    female_names = ['Sabah', 'Doaa', 'Doha', 'Yousra', 'Mayar', 'Mariam', 'Toaa', 'Esraa', 'Doaa', 'Marwa']

    for i in range(3178):
        if i % 2 == 0:
            student_name = random.choice(female_names) + " " + random.choice(male_names)
            student_gender = "Female"
        else:
            student_name = random.choice(male_names) + " " + random.choice(male_names)
            student_gender = "Male"

        student_id = str(i + 1)
        student_major = random.choice(majors)
        if student_major == "Computer Science":
            student_concentration = random.choice(concentrations)
        else:
            student_concentration = student_major
        student_age = random.randint(18, 25)
        student_gpa = round(random.uniform(0, 4.00), 2)
        student_gpa = round(student_gpa + random.choice([-0.2, 0.2]),2)
        if student_gpa > 4.0:
            student_gpa = float(3.8)

        if student_gpa >= 3.00:
            number_of_replaces = 0
            max_credits = 16
        elif 3.00 >= student_gpa >= 2.5:
            number_of_replaces = 1
            max_credits = 16
        elif 2.5 >= student_gpa >= 2.0:
            number_of_replaces = 2
            max_credits = 12
        elif 2.0 >= student_gpa >= 1.5:
            number_of_replaces = 3
            max_credits = 12
        else:
            number_of_replaces = 4
            max_credits = 12
        completed_credits = random.randrange(16, 144, 16)
        student_batch = str(2024 - (completed_credits // 32))
        required_credits = abs(completed_credits - 144)

        students_df = students_df._append({
            "student_id": student_id,
            "student_major": student_major,
            "student_age": student_age,
            "student_gender": student_gender,
            "student_name": student_name,
            "student_batch": student_batch,
            "student_gpa": student_gpa,
            "student_concentration": student_concentration,
            "completed_credits": completed_credits,
            "required_credits": required_credits,
            "number_of_replaces": number_of_replaces,
            "max_credits/semester": max_credits
        }, ignore_index=True)

    for i in range(len(students_df)):
        gpa = students_df.at[i, "student_gpa"]
        if gpa >= 3.00:
            students_df.at[i, "number_of_replaces"] = 0
            students_df.at[i, "max_credits/semester"] = 16
        elif 3.00 >= gpa >= 2.5:
            students_df.at[i, "number_of_replaces"] = 1
            students_df.at[i, "max_credits/semester"] = 16
        elif 2.5 >= gpa >= 2.0:
            students_df.at[i, "number_of_replaces"] = 2
            students_df.at[i, "max_credits/semester"] = 12
        elif 2.0 >= gpa >= 1.5:
            students_df.at[i, "number_of_replaces"] = 3
            students_df.at[i, "max_credits/semester"] = 12
        else:
            students_df.at[i, "number_of_replaces"] = 4
            students_df.at[i, "max_credits/semester"] = 12


    return students_df



# Function to generate instructor data
def generate_instructor_data():
    instructors_df = pd.DataFrame(columns=["instructor_id", "instructor_name", "instructor_rating",
                                           "number_of_researches", "years_experience"])

    male_names = ['Ahmed', 'Mohamed', 'Mahmoud', 'Moustafa', 'Yehia', 'Khalid', 'Youssef', 'Tamer', 'Naser',
                  'Abdelrahman']
    female_names = ['Sabah', 'Doaa', 'Doha', 'Yousra', 'Mayar', 'Mariam', 'Toaa', 'Esraa', 'Doaa', 'Marwa']

    for i in range(100):
        instructor_id = "I" + str(i + 1)
        if i % 5 == 0:
            instructor_name = random.choice(female_names) + " " + random.choice(male_names)+" "+ random.choice(male_names)
        else:
            instructor_name = random.choice(male_names) + " " + random.choice(male_names)+" "+ random.choice(male_names)
        instructor_rating = round(random.uniform(1.0, 5.0), 2)
        number_of_researches = random.randint(0, 20)
        years_experience = random.randint(1, 20)

        instructors_df = instructors_df._append({
            "instructor_id": instructor_id,
            "instructor_name": instructor_name,
            "instructor_rating": instructor_rating,
            "number_of_researches": number_of_researches,
            "years_experience": years_experience,
            "department": random.choice(["Computer Science", "Engineering", "Mathematics", "Science"])
        }, ignore_index=True)

    return instructors_df


# Function to generate financial data
def generate_financial_data(students_df):
    financials_df = pd.DataFrame(columns=["student_id", "student_major", "student_age", "student_gpa",
                                          "is_undergrad", "scholarship_percentage","student_batch", "student_outstanding_fees",
                                          "max_credits/semester"])

    for index, student_row in students_df.iterrows():
        financials_df = financials_df._append({
            "student_id": student_row["student_id"],
            "student_major": student_row["student_major"],
            "student_age": student_row["student_age"],
            "student_gpa": student_row["student_gpa"],
            "student_name": student_row["student_name"],
            "student_batch": student_row["student_batch"],
            "is_undergrad": "yes",
            "scholarship_percentage": 0,
            "student_outstanding_fees": 0,
            "max_credits/semester": 0
        }, ignore_index=True)

        gpa = student_row["student_gpa"]

        if gpa == 4.00:
            financials_df.at[index, "scholarship_percentage"] = 100
        elif 3.66 <= gpa < 4.00:
            financials_df.at[index, "scholarship_percentage"] = 35
        elif 3.33 <= gpa < 3.66:
            financials_df.at[index, "scholarship_percentage"] = 25
        elif 3.00 <= gpa < 3.33:
            financials_df.at[index, "scholarship_percentage"] = 10

        if "2024" in student_row["student_batch"]:
            financials_df.at[index, "student_outstanding_fees"] = 16 * 3200 - (16 * 3200 * financials_df.at[index, "scholarship_percentage"] / 100)
        elif "2023" in student_row["student_batch"]:
            financials_df.at[index, "student_outstanding_fees"] = 16 * 2800 - (16 * 2800 * financials_df.at[index, "scholarship_percentage"] / 100)
        elif "2022" in student_row["student_batch"]:
            financials_df.at[index, "student_outstanding_fees"] = 16 * 2000 - (16 * 2000 * financials_df.at[index, "scholarship_percentage"] / 100)
        elif "2021" in student_row["student_batch"]:
            financials_df.at[index, "student_outstanding_fees"] = 16 * 1800 - (16 * 1800 * financials_df.at[index, "scholarship_percentage"] / 100)
        elif "2020" in student_row["student_batch"]:
            financials_df.at[index, "student_outstanding_fees"] = 16 * 1600 - (16 * 1600 * financials_df.at[index, "scholarship_percentage"] / 100)
        elif "2019" in student_row["student_batch"]:
            financials_df.at[index, "student_outstanding_fees"] = 16 * 1400 - (16 * 1400 * financials_df.at[index, "scholarship_percentage"] / 100)
        elif "2018" in student_row["student_batch"]:
            financials_df.at[index, "student_outstanding_fees"] = 16 * 1200 - (16 * 1200 * financials_df.at[index, "scholarship_percentage"] / 100)

        # Update max_credits/semester based on GPA
        if gpa >= 3.00:
            financials_df.at[index, "max_credits/semester"] = 16
        elif 3.00 >= gpa >= 2.5:
            financials_df.at[index, "max_credits/semester"] = 16
        elif 2.5 >= gpa >= 2.0:
            financials_df.at[index, "max_credits/semester"] = 12
        elif 2.0 >= gpa >= 1.5:
            financials_df.at[index, "max_credits/semester"] = 12


    return financials_df


def gpa_to_letter_grade(gpa):
    if 4.0 >= gpa >= 3.7:
        return 'A'
    elif 3.7 > gpa >= 3.3:
        return 'A-'
    elif 3.3 > gpa >= 3.0:
        return 'B+'
    elif 3.0 > gpa >= 2.7:
        return 'B'
    elif 2.7 > gpa >= 2.3:
        return 'B-'
    elif 2.3 > gpa >= 2.0:
        return 'C+'
    elif 2.0 > gpa >= 1.7:
        return 'C'
    elif 1.7 > gpa >= 1.3:
        return 'C-'
    elif 1.3 > gpa >= 1.0:
        return 'D+'
    elif 1.0 > gpa >= 0.7:
        return 'D'
    elif 0.7 > gpa >= 0.0:
        return 'F'
    else:
        return 'Invalid GPA'


# Initialize an empty list to store course information
course_codes_dict = {
    "DS": ["CSAI 101", "CSAI 102", "CSAI 151", "CSAI 201", "CSAI 202",
           "CSAI 203", "CSAI 204", "CSAI 205", "CSAI 251", "CSAI 252",
           "CSAI 201", "CSAI 253", "CSAI 301", "CSAI 399", "CSAI 498",
           "CSAI 499",
           "DSAI 103", "DSAI 104", "DSAI 201", "DSAI 202", "DSAI 203",
           "DSAI 305", "DSAI 307", "DSAI 308", "DSAI 325", "DSAI 352",
           "DSAI 353", "DSAI 402", "DSAI 403", "DSAI 406", "DSAI 413",
           "DSAI 414", "DSAI 415", "DSAI 416", "DSAI 417", "DSAI 418",
           "DSAI 427", "DSAI 431", "DSAI 433", "DSAI 456", "DSAI 473",
           "DSAI 490"
           ],
    "IT": ["CSAI 101", "CSAI 102", "CSAI 151", "CSAI 201", "CSAI 202",
           "CSAI 203", "CSAI 204", "CSAI 205", "CSAI 251", "CSAI 252",
           "CSAI 201", "CSAI 253", "CSAI 301", "CSAI 399", "CSAI 498",
           "CSAI 499",
           "IT 101", "IT 102", "IT 103", "IT 205", "IT 206", "IT 220",
           "IT 222", "IT 308", "IT 309", "IT 310", "IT 401", "IT 402",
           "IT 411", "ITCC 301", "ITCC 403", "ITCC 404", "ITCC 405",
           "ITCC 406", "ITCC 407", "ITCC 408", "ITCC 410", "ITCC 411",
           "ITCC 412", "ITCC 413", "ITCC 414", "ITCC 415", "ITNS 301",
           "ITNS 302", "ITNS 403", "ITNS 404", "ITNS 406", "ITNS 407",
           "ITNS 408", "ITNS 410", "ITNS 411", "ITNS 412", "ITNS 413",
           "ITNS 414", "ITNS 415"
           ],
    "SW": ["CSAI 101", "CSAI 102", "CSAI 151", "CSAI 201", "CSAI 202",
           "CSAI 203", "CSAI 204", "CSAI 205", "CSAI 251", "CSAI 252",
           "CSAI 201", "CSAI 253", "CSAI 301", "CSAI 399", "CSAI 498",
           "CSAI 499",
           "SW 151", "SW 251", "SW 252", "SW 301", "SW 302", "SW 401",
           "SW 402", "SWAPD 301", "SWAPD 351", "SWAPD 352", "SWAPD 401",
           "SWAPD 402", "SWAPD 451", "SWAPD 452", "SWAPD 453", "SWGCG 301",
           "SWGCG 351", "SWGCG 352", "SWGCG 401", "SWGCG 402", "SWGCG 451",
           "SWGCG 452", "SWGCG 453", "SWHCI 301", "SWHCI 351", "SWHCI 352",
           "SWHCI 401", "SWHCI 402", "SWHCI 451", "SWHCI 452", "SWHCI 453"
           ],

    "Mathematics": ["MATH 101", "MATH 102", "MATH 103", "MATH 104", "MATH 105", "MATH 106", "MATH 107", "MATH 108",
                    "MATH 109", "MATH 110", "MATH 111", "MATH 112", "MATH 113", "MATH 114", "MATH 115", "MATH 116",
                    "MATH 117", "MATH 118",
                    "MATH 119", "MATH 120", "MATH 121", "MATH 122", "MATH 123", "MATH 124", "MATH 125", "MATH 126",
                    "MATH 127", "MATH 128", "MATH 129"
                    ],
    "Engineering": ["ENGR 101", "ENGR 102", "ENGR 103", "ENGR 104", "ENGR 105", "ENGR 106", "ENGR 107", "ENGR 108",
                    "ENGR 109", "ENGR 110", "ENGR 111", "ENGR 112", "ENGR 113", "ENGR 114", "ENGR 115", "ENGR 116",
                    "ENGR 117", "ENGR 118",
                    "ENGR 119", "ENGR 120", "ENGR 121", "ENGR 122", "ENGR 123", "ENGR 124", "ENGR 125", "ENGR 126",
                    "ENGR 127", "ENGR 128", "ENGR 129"
                    ],
    "Science": ["SCIE 101", "SCIE 102", "SCIE 103", "SCIE 104", "SCIE 105", "SCIE 106", "SCIE 107", "SCIE 108",
                "SCIE 109", "SCIE 110", "SCIE 111", "SCIE 112", "SCIE 113", "SCIE 114", "SCIE 115", "SCIE 116",
                "SCIE 117", "SCIE 118",
                "SCIE 119", "SCIE 120", "SCIE 121", "SCIE 122", "SCIE 123", "SCIE 124", "SCIE 125", "SCIE 126",
                "SCIE 127", "SCIE 128", "SCIE 129"
                ],

}

# Function to generate courses data


# Your existing code...

# Function to generate courses data
import random


def generate_courses_data(course_codes_dict, instructors_df):
    courses_df = pd.DataFrame(columns=["course_code", "course_title", "course_credits", "course_semester",
                                      "course_year", "course_instructor"])

    department = ""
    course_title = ""
    for course_year_r in range(2019, 2025):
        for course_code in course_codes_dict:
            for course in course_codes_dict[course_code]:
                if "CSAI" in course or "DS" in course:
                    course_title = "Data Science"
                    department = "Computer Science"
                elif "IT" in course:
                    department = "Computer Science"
                    course_title = "Information Technology"
                elif "SW" in course:
                    department = "Computer Science"
                    course_title = "Software Engineering"
                elif "MATH" in course:
                    department = "Mathematics"
                    course_title = "Mathematics"
                elif "ENGR" in course:
                    department = "Engineering"
                    course_title = "Engineering"
                elif "SCIE" in course:
                    department = "Science"
                    course_title = "Science"


                course_instructor = instructors_df[instructors_df["department"] == department]['instructor_id'].sample(1).values[0]
                course_credits = 3
                course_semester = random.choice(["Fall", "Spring", "Summer"])
                course_year = course_year_r


                courses_df = courses_df._append({
                    "course_code": course,
                    "course_title": course_title,
                    "course_credits": course_credits,
                    "course_semester": course_semester,
                    "course_year": course_year,
                    "course_instructor": course_instructor
                }, ignore_index=True)

    return courses_df
instructors_df = generate_instructor_data()
courses_df = generate_courses_data(course_codes_dict, instructors_df)


def generate_student_grades_reports(courses_df, students_df):
    students_grades_reports_df = pd.DataFrame(
        columns=["student_id", "course_code", "course_title", "course_year", "course_semester", "student_grade"])

    for _,course_row in courses_df.iterrows():
        course_code = course_row["course_code"]
        course_title = course_row["course_title"]
        course_year = course_row["course_year"]
        course_semester = course_row["course_semester"]

        course_students = students_df[students_df["student_concentration"] == course_title]
        course_students = course_students.sample(n=50)

        for _,student_row in course_students.iterrows():
            student_id = _
            student_gpa = student_row["student_gpa"]
            student_grade = abs(student_gpa*25 + random.randint(-15, 15))

            students_grades_reports_df = students_grades_reports_df._append({
                "student_id": student_id,
                "course_code": course_code,
                "course_title": course_title,
                "course_year": course_year,
                "course_semester": course_semester,
                "student_grade": student_grade,
            }, ignore_index=True)

    return students_grades_reports_df




# Call the function


students_df = generate_student_data()

financials_df = generate_financial_data(students_df)
students_grades_reports_df = generate_student_grades_reports(courses_df, students_df)

students_df.set_index("student_id", inplace=True)

instructors_df.set_index("instructor_id", inplace=True)





from sqlalchemy import create_engine
import sqlite3

engine = create_engine('sqlite:///university.db', echo=True)
sqlite_connection = engine.connect()

sqlite_table = "students"
students_df.to_sql(sqlite_table, sqlite_connection, if_exists='replace')

sqlite_table = "instructors"
instructors_df.to_sql(sqlite_table, sqlite_connection, if_exists='replace')

sqlite_table = "financials"
financials_df.to_sql(sqlite_table, sqlite_connection, if_exists='replace')

sqlite_table = "courses"
courses_df.to_sql(sqlite_table, sqlite_connection, if_exists='replace')

sqlite_table = "students_grades"
students_grades_reports_df.to_sql(sqlite_table, sqlite_connection, if_exists='replace')


sqlite_connection.close()


