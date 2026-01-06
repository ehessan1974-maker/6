from flask import Flask, jsonify, render_template
import csv

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/data')
def get_data():
    with open("مواقيت_الصلاة.csv", encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter=";")
        data = [row for row in reader]
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
