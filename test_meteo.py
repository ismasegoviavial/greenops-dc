import requests
import datetime

def main():
    yesterday = (datetime.date.today() - datetime.timedelta(days=1)).strftime("%Y-%m-%d")
    lat, lon = -54.95, -69.65  # Isla Gordon
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&hourly=temperature_2m&start_date={yesterday}&end_date={yesterday}"
    try:
        r = requests.get(url)
        print("Status code:", r.status_code)
        data = r.json()
        print("Keys:", data.keys())
        if "hourly" in data:
            print("Time sample:", data["hourly"]["time"][:3])
            print("Temp sample:", data["hourly"]["temperature_2m"][:3])
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    main()
