# Zewail City Dashboard


## Overview
This Zewail City Dashboard is an interactive web application that manages and visualizes administrative data for a university. It utilizes Flask, a micro web framework for Python, to serve web pages that dynamically display financial summaries, instructor performances, and student statistics. On the frontend, AmCharts is used for rich data visualization.

## Features
- Comprehensive financial overview with summaries, discounts, and student counts.
- Interactive data visualization for revenue per major, impact of scholarships, and distribution of scholarship holders across batches.
- Instructor performance analytics with bullet charts and ratings.
- Student academic dashboard showcasing GPA distributions, probation counts, and enrollment graphs.

## Installation

Before you can run the admin dashboard, you must install the necessary dependencies:

1. **Python**: Ensure you have Python 3.10+ installed on your system. You can download it from [python.org](https://www.python.org/downloads/).

2. **Git**: To clone the repository, [Git](https://git-scm.com/downloads) must be installed.

3. **Virtual Environment** (recommended): It's a good practice to create a virtual environment. You can set one up by running:

```bash
python -m venv venv
```
And activate it with:

On Windows:
```bash
venv\Scripts\activate
```
On macOS and Linux:
```bash
source venv/bin/activate
```

Dependencies: Install the project’s dependencies with:
```bash
pip install -r requirements.txt
```
Once dependencies are installed, you can populate the SQLite database with initial data using the provided data generation script:
```bash
python data.py
```
Usage
After installation, you can start the Flask server by running:
```bash
flask run
```
or
```bash
python -m flask run
```
The application will be available at http://127.0.0.1:5000 by default.

```bash
Project Structure
/project
│    app.py              # Main Flask application entry point
│    data.py             # Script to generate and populate the database with mock data
│
├── /templates           # HTML templates for the application
│    │ financials.html
│    │ instructors.html
│    │ students.html
│    └ ...
│
├── /static              # Static files such as JavaScript, Stylesheets, and images
│    │ financials.js
│    │ instructors.js
│    │ student.js
│    └ ...
│
└── requirements.txt     # List of dependencies to be installed
```
## Dependencies
**JavaScript Dependencies**
- **amCharts:** Utilized for rendering charts and graphs for the financial, instructors, and student modules.

- **Bootstrap:** Provides styling and responsive layouts for the dashboard.

**Flask Dependencies (Python)**
- **Flask:** The backbone of our web application for routing and views.

- **Pandas:** Used for data manipulation and analysis.

- **SQLite:** The database used with Flask for local data storage.

- **SQLAlchemy:** An ORM and database toolkit for Python applications.



## Acknowledgments
Special thanks to the amCharts team for providing powerful charting solutions used throughout this dashboard.
