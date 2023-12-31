from flask import Flask, jsonify, render_template,request
import sqlite3
import pandas as pd
import json
import random

app = Flask(__name__)


global selected_course


@app.route('/')
def index():
    conn = sqlite3.connect('university.db')

    query = 'SELECT student_id, student_major,student_gpa,number_of_replaces FROM students'
    df = pd.read_sql_query(query, conn)

    total_students = df.count()[0]


    query = """
    SELECT student_name,student_major,student_gpa FROM students
    ORDER BY student_gpa DESC,student_batch ASC 
    LIMIT 21
    """

    df_s = pd.read_sql_query(query, conn)
    conn.close()

    student_dict = df_s.to_dict(orient='records')

    on_propation = df[df["student_gpa"] < 2.2].count()["student_id"]
    repeating = df[df["number_of_replaces"] > 0].count()["student_id"]

    return render_template('students.html', on_propation=on_propation, total_students=total_students,
                           repeating=repeating, students=student_dict)


@app.route('/financials')
def financials():
    conn = sqlite3.connect('university.db')

    select_query = 'SELECT count(student_id), sum(student_outstanding_fees) FROM financials'
    discount_query = 'SELECT scholarship_percentage,student_outstanding_fees, "max_credits/semester" FROM financials '

    df = pd.read_sql_query(select_query, conn)
    df_discount = pd.read_sql_query(discount_query, conn)

    conn.close()

    import math
    def millify(n):
        n = float(n)
        millnames = ['', ' K', ' M', ' B', ' T']
        millidx = max(0, min(len(millnames) - 1,
                             int(math.floor(0 if n == 0 else math.log10(abs(n)) / 3))))

        return '£' + str(n / 10 ** (3 * millidx)) + str(millnames[millidx])


    df_discount['sum'] = df_discount['student_outstanding_fees'] / (1 - df_discount['scholarship_percentage'] / 100)

    student_count = df.loc[0, "count(student_id)"]

    total = float(df.loc[0, "sum(student_outstanding_fees)"])

    total_fees = millify(float(df.loc[0, "sum(student_outstanding_fees)"]))


    total_discount = millify(float(df_discount['sum'].sum() - total))

    return render_template('financials.html', student_count=student_count, total_fees=total_fees,
                           total_discount=total_discount)

@app.route('/get-students-cost')
def getStudentsCost():
    conn = sqlite3.connect('university.db')

    query = 'SELECT scholarship_percentage,student_outstanding_fees,student_major FROM financials'

    df = pd.read_sql_query(query, conn)

    conn.close()

    df['original_fees'] = df['student_outstanding_fees'] / (1 - df['scholarship_percentage'] / 100)
    df['student_outstanding_fees'] = df['student_outstanding_fees']
    data = df.groupby(['student_major'])[['original_fees', 'student_outstanding_fees']].sum().reset_index()

    data = data.rename(
        columns={'student_major': 'country', 'original_fees': 'year2004', 'student_outstanding_fees': 'year2005'})

    json_data = data.to_json(orient='records')

    return json_data

@app.route('/get-scores')
def getScores():
    global selected_course
    selected_course = request.args.get('course')
    conn = sqlite3.connect('university.db')

    query = f"""SELECT courses.course_code, instructors.instructor_rating,instructors.instructor_name,course_semester, courses.course_year
    FROM courses
    INNER JOIN instructors ON courses.course_instructor = instructors.instructor_id
    where course_code like '{selected_course}'"""
    df = pd.read_sql_query(query, conn)
    conn.close()
    df["instructor_rating"] = round(df["instructor_rating"] + random.uniform(-0.5, 0.5), 2)
    df["instructor_rating"] = df["instructor_rating"].apply(lambda x: 5 if x > 5 else x)

    minimum = df["instructor_rating"].min()
    mean = round(df["instructor_rating"].mean(), 2)
    maximum = df["instructor_rating"].max()
    list = []

    for i in df.iterrows():
        list.append(
            {"instructor_name": i[1]["instructor_name"] + ", " + i[1]["course_semester"] + " " + str(
                i[1]["course_year"]), "minimum_score": minimum,
             "actual": round((i[1]["instructor_rating"] + random.uniform(-0.5, 0.5)), 2),
             "average": mean, "maximum_score": maximum})
    conn.close()

    return jsonify(list)

@app.route('/instructors', methods=['GET', 'POST'])
def instructors():
    global selected_course
    if request.method == 'POST':
        selected_major = request.form.get('majors')
        selected_course = request.form.get('courses')

    major = "Data Science"
    conn = sqlite3.connect('university.db')
    query = """SELECT distinct(course_title) FROM courses"""
    pandas_query = f"SELECT distinct(course_code) FROM courses WHERE course_title LIKE '{major}'"
    instructors_query = """
        SELECT instructor_name, instructor_rating, department
        FROM instructors
        ORDER BY instructor_rating DESC
        LIMIT 40;
        """
    df = pd.read_sql_query(pandas_query, conn)
    df_m = pd.read_sql_query(query, conn)
    df_i = pd.read_sql_query(instructors_query, conn)
    course_list = df["course_code"].tolist()
    majors = df_m["course_title"].tolist()
    instructors_dict = df_i.to_dict(orient="records")
    conn.close()

    return render_template('instructors.html', courses=course_list, majors=majors, instructors=instructors_dict)


@app.route('/get-instructor-percentage')
def getInstructorPercentage():

    conn = sqlite3.connect('university.db')

    query = "SELECT * FROM instructors"
    df_i = pd.read_sql_query(query, conn)

    df_g = df_i[df_i['instructor_rating'] > df_i['instructor_rating'].mean()]

    count = []
    for i in range(4):
        count.append(
            round(df_g['department'].value_counts().iloc[i] / df_i['department'].value_counts().iloc[i] * 100, 1))

    return count
@app.route('/get_courses', methods=['GET'])
def get_courses():
    major = request.args.get('major')

    conn = sqlite3.connect('university.db')
    pandas_query = f"SELECT distinct(course_code) FROM courses WHERE course_title like '{major}'"
    df = pd.read_sql_query(pandas_query, conn)
    courses = df["course_code"].tolist()
    conn.close()

    return jsonify({'courses': courses})


@app.route('/students')
def students():
    conn = sqlite3.connect('university.db')

    query = 'SELECT student_id, student_major,student_gpa,number_of_replaces FROM students'
    df = pd.read_sql_query(query, conn)

    total_students = df.count()[0]


    query = """
    SELECT student_name,student_major,student_gpa FROM students
    ORDER BY student_gpa DESC,student_batch ASC 
    LIMIT 21
    """

    df_s = pd.read_sql_query(query, conn)
    conn.close()

    student_dict = df_s.to_dict(orient='records')

    on_propation = df[df["student_gpa"] < 2.2].count()["student_id"]
    repeating = df[df["number_of_replaces"] > 0].count()["student_id"]

    return render_template('students.html', on_propation=on_propation, total_students=total_students,
                           repeating=repeating, students=student_dict)


@app.route('/get-eng-gpa')
def getGPAEng():
    conn = sqlite3.connect('university.db')

    query = 'SELECT student_gpa,student_major FROM students'
    df = pd.read_sql_query(query, conn)

    conn.close()

    df = df[df["student_major"] == "Engineering"]
    gpa_counts = df.groupby(pd.cut(df["student_gpa"], [x / 10.0 for x in range(0, 42, 2)])).count()[
        "student_gpa"].tolist()

    distrib_intervals = [x / 10.0 for x in range(0, 42, 2)]

    data = [{"GPA": distribution, "value": gpa} for gpa, distribution in zip(gpa_counts, distrib_intervals)]

    return jsonify(data)


@app.route('/get-sc-gpa')
def getGPASC():
    conn = sqlite3.connect('university.db')

    query = 'SELECT student_gpa,student_major FROM students'
    df = pd.read_sql_query(query, conn)

    conn.close()

    df = df[df["student_major"] == "Science"]
    gpa_counts = df.groupby(pd.cut(df["student_gpa"], [x / 10.0 for x in range(0, 42, 2)])).count()[
        "student_gpa"].tolist()

    distrib_intervals = [x / 10.0 for x in range(0, 42, 2)]

    data = [{"GPA": distribution, "value": gpa} for gpa, distribution in zip(gpa_counts, distrib_intervals)]

    return jsonify(data)


@app.route('/get-cs-gpa')
def getGPACS():
    conn = sqlite3.connect('university.db')

    query = 'SELECT student_gpa,student_major FROM students'
    df = pd.read_sql_query(query, conn)

    conn.close()

    df = df[df["student_major"] == "Computer Science"]

    gpa_counts = df.groupby(pd.cut(df["student_gpa"], [x / 10.0 for x in range(0, 42, 2)])).count()[
        "student_gpa"].tolist()

    distrib_intervals = [x / 10.0 for x in range(0, 42, 2)]

    data = [{"GPA": distribution, "value": gpa} for gpa, distribution in zip(gpa_counts, distrib_intervals)]

    return jsonify(data)


@app.route('/get-math-gpa')
def getGPAMath():
    conn = sqlite3.connect('university.db')

    query = 'SELECT student_gpa,student_major FROM students'
    df = pd.read_sql_query(query, conn)

    conn.close()

    df = df[df["student_major"] == "Mathematics"]

    gpa_counts = df.groupby(pd.cut(df["student_gpa"], [x / 10.0 for x in range(0, 42, 2)])).count()[
        "student_gpa"].tolist()

    distrib_intervals = [x / 10.0 for x in range(0, 42, 2)]

    data = [{"GPA": distribution, "value": gpa} for gpa, distribution in zip(gpa_counts, distrib_intervals)]

    return jsonify(data)

@app.route('/get-scholarship-percentage')
def getScholarshipPercentage():
    conn = sqlite3.connect('university.db')


    query = """ SELECT student_batch,student_major,COUNT(student_id) as count
                FROM financials
                WHERE scholarship_percentage != 0
                GROUP BY student_major, student_batch"""

    df = pd.read_sql_query(query, conn)
    df.set_index("student_batch", inplace=True)
    result = df.reset_index().to_json(orient='records')

    data = json.loads(result)

    result_dict = {}
    for entry in data:
        year = entry["student_batch"]
        major = entry["student_major"]
        count = entry["count"]

        if year not in result_dict:
            result_dict[year] = {}

        result_dict[year][major] = count

    result_list = [{"year": year, **majors} for year, majors in result_dict.items()]

    result_json = json.dumps(result_list, indent=2)

    conn.close()

    return result_json

@app.route('/get-mean-grades')
def getMeanGrades():
    def convert_grades_to_format(grades_dict):
        result_list = []

        subjects = set(subject_year[0] for subject_year in grades_dict['student_grade'].keys())
        years = set(subject_year[1] for subject_year in grades_dict['student_grade'].keys())

        for year in sorted(years):
            year_data = {"year": str(year)}
            for subject in sorted(subjects):
                subject_year_key = (subject, year)
                if subject_year_key in grades_dict['student_grade']:
                    subject_grade = grades_dict['student_grade'][subject_year_key]
                    region = subject.lower()
                    year_data[region] = round(subject_grade, 3)

            result_list.append(year_data)

        return result_list

    conn = sqlite3.connect('university.db')

    query = """
    SELECT student_major, course_year, AVG(student_grade) AS student_grade
    FROM students
    JOIN students_grades ON students.student_id = students_grades.student_id
    GROUP BY student_major, course_year;
    """
    df = pd.read_sql_query(query, conn)
    df.set_index(['student_major', 'course_year'], inplace=True)
    df.sort_values(by=['course_year'], inplace=True)

    conn.close()

    data = convert_grades_to_format(df.to_dict())

    return jsonify(data)

@app.route('/get-major-enrollment')
def getMajorEnrollment():
    conn = sqlite3.connect('university.db')

    query = """SELECT student_major, student_batch, count(student_id) as count FROM students
             GROUP BY student_major, student_batch"""

    df = pd.read_sql_query(query, conn)
    df.set_index(["student_major", "student_batch"], inplace=True)

    conn.close()

    result = {}

    for key, value in df.iterrows():
        category, year = key
        if category not in result:
            result[category] = []
        result[category].append({"ax": str(year), "ay": int(value['count'])})

    for category in result:
        result[category] = sorted(result[category], key=lambda x: x["ax"])

    result = dict(sorted(result.items()))

    return jsonify(result)



@app.route('/get-majors-fees')
def getMajorsFees():
    conn = sqlite3.connect('university.db')

    query = """
    SELECT student_major, student_batch ,sum(student_outstanding_fees) as student_outstanding_fees
    FROM financials
    GROUP BY student_major,student_batch"""
    df = pd.read_sql_query(query, conn)
    conn.close()
    df.reset_index()

    def convert_fees_to_format(df):
        result_list = []
        for _, row in df.iterrows():
            entry = {
                "major": row['student_major'],
                "year": str(row['student_batch'] + " " + row['student_major']),
                "fees": round(row['student_outstanding_fees'])
            }
            result_list.append(entry)
        return result_list

    data = convert_fees_to_format(df)
    return jsonify(data)


@app.route('/get-students-count')
def getStudentsCount():
    conn = sqlite3.connect('university.db')

    query = 'SELECT student_id, student_major,student_gpa FROM students'
    df = pd.read_sql_query(query, conn)

    df_grouped = df.groupby("student_major")["student_id"].count()

    conn.close()

    data = [{"value": count, "major": major} for major, count in zip(df_grouped.index.tolist(), df_grouped.tolist())]

    return jsonify(data)

@app.route('/get-instructor-rating-research-cs')
def getInstructorRatingResearchCs():
    conn = sqlite3.connect('university.db')

    query = 'SELECT instructor_name,instructor_rating,number_of_researches,department FROM instructors'
    df = pd.read_sql_query(query, conn)

    conn.close()

    df_i = df[df["department"] == "Computer Science"]
    df_i = df_i.drop(columns=['department'])

    df_i = df_i.sort_values(by=['number_of_researches'], ascending=True)

    df_i['instructor_name'] = df_i['instructor_name'].apply(lambda x: x.replace(x.split()[1], x.split()[1][0] + '.'))

    data = df_i.rename(
        columns={'instructor_name': 'country', 'instructor_rating': 'year2004', 'number_of_researches': 'year2005'})
    json_data = data.to_json(orient='records')
    return json_data
@app.route('/get-instructor-rating-research-eng')
def getInstructorRatingResearchEng():
    conn = sqlite3.connect('university.db')

    query = 'SELECT instructor_name,instructor_rating,number_of_researches,department FROM instructors'
    df = pd.read_sql_query(query, conn)

    conn.close()

    df_i = df[df["department"] == "Engineering"]
    df_i = df_i.drop(columns=['department'])

    df_i = df_i.sort_values(by=['number_of_researches'], ascending=True)

    df_i['instructor_name'] = df_i['instructor_name'].apply(lambda x: x.replace(x.split()[1], x.split()[1][0] + '.'))

    data = df_i.rename(
        columns={'instructor_name': 'country', 'instructor_rating': 'year2004', 'number_of_researches': 'year2005'})
    json_data = data.to_json(orient='records')
    return json_data
@app.route('/get-instructor-rating-research-sci')
def getInstructorRatingResearchSci():
    conn = sqlite3.connect('university.db')

    query = 'SELECT instructor_name,instructor_rating,number_of_researches,department FROM instructors'
    df = pd.read_sql_query(query, conn)

    conn.close()

    df_i = df[df["department"] == "Science"]
    df_i = df_i.drop(columns=['department'])

    df_i = df_i.sort_values(by=['number_of_researches'], ascending=True)

    df_i['instructor_name'] = df_i['instructor_name'].apply(lambda x: x.replace(x.split()[1], x.split()[1][0] + '.'))

    data = df_i.rename(
        columns={'instructor_name': 'country', 'instructor_rating': 'year2004', 'number_of_researches': 'year2005'})
    json_data = data.to_json(orient='records')
    return json_data
@app.route('/get-instructor-rating-research-math')
def getInstructorRatingResearchMath():
    conn = sqlite3.connect('university.db')

    query = 'SELECT instructor_name,instructor_rating,number_of_researches,department FROM instructors'
    df = pd.read_sql_query(query, conn)

    conn.close()

    df_i = df[df["department"] == "Mathematics"]
    df_i = df_i.drop(columns=['department'])

    df_i = df_i.sort_values(by=['number_of_researches'], ascending=True)

    df_i['instructor_name'] = df_i['instructor_name'].apply(lambda x: x.replace(x.split()[1], x.split()[1][0] + '.'))

    data = df_i.rename(
        columns={'instructor_name': 'country', 'instructor_rating': 'year2004', 'number_of_researches': 'year2005'})
    json_data = data.to_json(orient='records')
    return json_data

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=1628, debug=True)
