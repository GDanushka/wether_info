import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './WeatherDetailsView.css';

function WeatherDetailsView() {
  const [data, setData] = useState({});
  const [forecastData, setForecastData] = useState([]);
  const [location, setLocation] = useState('');
  const [showThreeDayForecast, setShowThreeDayForecast] = useState(false);
  const weatherApiKey = '895284fb2d2c50a520ea537456963d9c';

  const fetchWeatherData = () => {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${weatherApiKey}`;

    axios
      .get(weatherUrl)
      .then((response) => {
        setData(response.data);
        if (response.data.coord) {
          const forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}&exclude=current,minutely,hourly&units=imperial&appid=${weatherApiKey}`;

          axios
            .get(forecastUrl)
            .then((forecastResponse) => {
              setForecastData(forecastResponse.data.daily.slice(1, 4));
            })
            .catch((forecastError) => {
              console.error('Error fetching forecast data:', forecastError);
            });
        }
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  };

  const handleClick = () => {
    setShowThreeDayForecast(true);
  };

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      fetchWeatherData();
      setLocation('');
    }
  };

  const threeDays = (forecastData) => {
    return (
      <>
        {forecastData.map((day, index) => (
             <div key={ index } className="forecast-day">
            <div
              className='d-flex justify-content-center align-items-center mb-3'
              style={ { backgroundColor: 'lightblue', borderRadius: '10px' } }>
                 <p className="font-weight-bold">Date: { new Date(day.dt * 1000).toLocaleDateString() }</p>
               </div>
                 <div className='row text-center'>
                    <div className='col-4'><p>Temperature</p></div>
                    <div className='col-4'>:</div>
                    <div className='col-4'><p> {day.temp.day}°F</p></div>
                  </div>
                  <div className='row text-center'>
                    <div className='col-4'><p>Weather</p></div>
                    <div className='col-4'>:</div>
                    <div className='col-4'><p>{day.weather[0].main}</p></div>
                  </div>
           </div>
        ))}
      </>
    );
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Weather Details</h2>
              <div className="mb-3">
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  onKeyPress={searchLocation}
                  placeholder='Enter Location'
                  type="text"
                  className="form-control"
                />
              </div>
              {data.name && (
                <div className="mb-3">
                  <h3>{ data.name }</h3>
                  <div className='row text-center'>
                    <div className='col-4'><p>Temperature</p></div>
                    <div className='col-4'>:</div>
                    <div className='col-4'><p>{data.main.temp.toFixed()}°C</p></div>
                  </div>
                  <div className='row text-center'>
                    <div className='col-4'><p>Weather</p></div>
                    <div className='col-4'>:</div>
                    <div className='col-4'><p>{data.weather[0].main}</p></div>
                  </div>
                   <div className='row text-center'>
                    <div className='col-4'><p>Feels Like</p></div>
                    <div className='col-4'>:</div>
                    <div className='col-4'><p>{data.main.feels_like.toFixed()}°C</p></div>
                  </div>
                  <div className='row text-center'>
                    <div className='col-4'><p>Humidity</p></div>
                    <div className='col-4'>:</div>
                    <div className='col-4'><p>{data.main.humidity}%</p></div>
                  </div>
                  <div className='row text-center'>
                    <div className='col-4'><p>Wind Speed</p></div>
                    <div className='col-4'>:</div>
                    <div className='col-4'><p>{data.wind.speed.toFixed()} MPH</p></div>
                  </div>
                </div>
              )}
              {data.name && !showThreeDayForecast && (
                <div className="forecast">
                  <button className='custom-button w-100' onClick={handleClick}>Show 3-Day Forecast</button>
                </div>
              )}
              {showThreeDayForecast && threeDays(forecastData)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherDetailsView;
