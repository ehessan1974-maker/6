import csv, json

with open("مواقيت_الصلاة.csv", encoding="utf-8") as f:
    reader = csv.DictReader(f, delimiter=";")
    data = [row for row in reader]

# نحفظه كملف JavaScript فيه متغير جاهز
with open("data.js", "w", encoding="utf-8") as f:
    f.write("const prayerTimes = ")
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write(";")
