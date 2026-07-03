# 🌦️ WeatherPulse Dashboard

WeatherPulse is a responsive weather monitoring dashboard that displays real weather information for cities around the world. It allows users to search for cities, monitor multiple locations, switch between Celsius and Fahrenheit, view important weather metrics, and explore temperature trends through interactive charts.

The application uses **Open-Meteo** for real weather data and city geocoding.

---

## 📌 Project Overview

WeatherPulse Dashboard is a frontend web application designed to provide weather information through a modern and interactive interface.

Users can search for cities worldwide and view weather details such as temperature, feels-like temperature, humidity, wind speed, atmospheric pressure, visibility, UV index, and current weather conditions.

The dashboard also supports multiple-city monitoring, automatic weather updates, weather status indicators, and interactive temperature trend charts.

---

## ✨ Features

- 🌍 Search for cities worldwide
- ➕ Add and monitor multiple cities
- ⚡ Quick-add buttons for popular cities
- 🌡️ Display current temperature
- 🤒 Display feels-like temperature
- 💧 View humidity levels
- 💨 View wind speed
- 🌬️ View atmospheric pressure
- 👁️ View visibility
- ☀️ View UV index
- 🌤️ Display current weather conditions with icons
- 🔄 Automatic weather data refresh
- ⏱️ Live refresh countdown timer
- 🌡️ Switch between Celsius and Fahrenheit
- 📊 Interactive temperature trend chart
- 🕕 View 6-hour temperature trends
- 🕛 View 12-hour temperature trends
- 🕒 View 24-hour temperature trends
- 🏙️ Monitor multiple cities simultaneously
- ❌ Remove cities from the dashboard
- ⚠️ Weather status indicators for:
  - Normal conditions
  - Extreme heat
  - High humidity
  - Extreme cold
  - Storm warnings
- 🔍 Invalid city detection and error messages
- 📱 Responsive interface for different screen sizes
- 🔔 Toast notifications for user actions

---

## 🛠️ Technologies Used

### Frontend

- **HTML5** — application structure
- **CSS3** — styling, responsive layout, animations, and dashboard design
- **JavaScript (ES6+)** — application logic, API integration, DOM manipulation, validation, and dynamic updates

### Libraries

- **Chart.js** — interactive temperature trend visualization

### APIs

- **Open-Meteo Weather API** — weather information
- **Open-Meteo Geocoding API** — city search and geographic coordinate lookup

### Deployment

- **Netlify** — live application hosting
- **GitHub** — source code hosting and version control

---

## 🌐 Open-Meteo Integration

WeatherPulse uses **Open-Meteo** to retrieve weather information for cities around the world.

The application follows this flow:

```text
User enters a city name
        ↓
Open-Meteo Geocoding API searches for the city
        ↓
Latitude and longitude are retrieved
        ↓
Open-Meteo Weather API fetches weather data
        ↓
WeatherPulse processes the response
        ↓
Dashboard updates dynamically
```

The application retrieves and displays weather information including:

- Temperature
- Relative humidity
- Apparent temperature
- Weather condition codes
- Wind speed
- Surface pressure
- Visibility
- UV index
- Hourly temperature data

Weather condition codes are mapped to readable weather descriptions and visual icons within the dashboard.

---

## 📸 Screenshots

### Dashboard Overview

Add your main dashboard screenshot here:

```markdown
![WeatherPulse Dashboard](screenshots/dashboard.png)
```

### Multi-City Weather Monitoring

```markdown
![Multi-City Weather Monitoring](screenshots/multi-city-view.png)
```

### Temperature Trend Chart

```markdown
![Temperature Trend Chart](screenshots/temperature-trends.png)
```

> **Note:** Create a folder named `screenshots` in the repository and upload your project screenshots into that folder.

Suggested structure:

```text
screenshots/
├── dashboard.png
├── multi-city-view.png
└── temperature-trends.png
```

---

## 🚀 Live Demo

The application is deployed on Netlify.

🔗 **Live Website:**

[View WeatherPulse Dashboard](https://weatherpulse-dashboard.netlify.app)

---

## 📁 Project Structure

```text
weatherpulse-dashboard/
│
├── index.html
├── style.css
├── script.js
├── README.md
│
└── screenshots/
    ├── dashboard.png
    ├── multi-city-view.png
    └── temperature-trends.png
```

### File Description

| File | Purpose |
|------|---------|
| `index.html` | Defines the structure and content of the dashboard |
| `style.css` | Contains styling, responsive design, animations, and UI components |
| `script.js` | Handles API integration, weather data processing, city management, unit conversion, auto-refresh, and chart updates |
| `README.md` | Contains project documentation |
| `screenshots/` | Stores application screenshots |

---

## 💻 How to Run Locally

Follow these steps to run WeatherPulse on your computer.

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/weatherpulse-dashboard.git
```

### 2. Navigate to the project folder

```bash
cd weatherpulse-dashboard
```

### 3. Open the application

Open:

```text
index.html
```

in a web browser.

You can also use a local development server such as the **Live Server** extension in Visual Studio Code.

### 4. Ensure internet connectivity

An active internet connection is required because the application retrieves weather data from Open-Meteo.

---

## 🎯 How to Use

1. Open the WeatherPulse Dashboard.
2. Enter a city name in the search field.
3. Click **Add City**.
4. View the city's weather information.
5. Add multiple cities for simultaneous monitoring.
6. Switch between **°C** and **°F**.
7. Use the **6H**, **12H**, and **24H** buttons to change the temperature trend range.
8. Remove a city using the **×** button on its weather card.

---

## 👩‍💻 Author

**Lasya Polisetti**

B.Tech Computer Science and Engineering Student  
VIT-AP University

- GitHub: `@lasyapolisetti`
- LinkedIn: `Lasya Polisetti`

---

## 📄 Acknowledgements

- Weather data and geocoding services provided by **Open-Meteo**
- Interactive charts powered by **Chart.js**
- Application deployed using **Netlify**

---

⭐ If you found this project useful, consider giving the repository a star!
