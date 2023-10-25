import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function WeatherDetailsView() {
  const [data, setData] = useState({});
  const [forecastData, setForecastData] = useState([]);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [showThreeDayForecast, setShowThreeDayForecast] = useState(false);
  const weatherApiKey = '895284fb2d2c50a520ea537456963d9c'; // Replace with your OpenWeatherMap API key

  const fetchWeatherData = (lat, lon) => {
    // Validate latitude and longitude values
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      console.error('Invalid latitude or longitude values.');
      return;
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherApiKey}`;

    axios
      .get(weatherUrl)
      .then((response) => {
        setData(response.data);
        setShowThreeDayForecast(false); // Reset to show weather details only
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

  const resetData = () => {
    setData({});
    setForecastData([]);
    setShowThreeDayForecast(false);
    setLatitude('');
    setLongitude('');
  };

  return (
    <div className="container mt-1">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Weather Details</h2>
              <div className="mb-3">
                <input
                  value={latitude}
                  onChange={(event) => setLatitude(event.target.value)}
                  placeholder='Enter Latitude'
                  type="text"
                  className="form-control"
                />
                <input
                  value={longitude}
                  onChange={(event) => setLongitude(event.target.value)}
                  placeholder='Enter Longitude'
                  type="text"
                  className="form-control mt-2"
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
                  <button className='custom-button' onClick={handleClick}>Show 3-Day Forecast</button>
                </div>
              )}
              {showThreeDayForecast && (
                <div className="forecast-day">
                  {forecastData.map((day, index) => (
                    <div key={index}>
                      <div
              className='d-flex justify-content-center align-items-center'
              style={ { backgroundColor: '#cdd3d39c', borderRadius: '5px' } }>
                 <h5 className="font-weight-bold">Date: { new Date(day.dt * 1000).toLocaleDateString() }</h5>
                      </div>
                      <div className='row text-center'>
                    <div className='col-4'><p>Temperature</p></div>
                    <div className='col-4'>:</div>
                    <div className='col-4'><p>{day.temp.day}°F</p></div>
                      </div>
                      <div className='row text-center'>
                    <div className='col-4'><p>Feels Like</p></div>
                    <div className='col-4'>:</div>
                    <div className='col-4'><p>{data.main.feels_like.toFixed()}°C</p></div>
                      </div>
                      <div className='row text-center'>
                    <div className='col-4'><p>Weather</p></div>
                    <div className='col-4'>:</div>
                    <div className='col-4'><p>{day.weather[0].main}</p></div>
            </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="forecast mt-3">
                {!showThreeDayForecast && <button className="custom-button" onClick={() => fetchWeatherData(latitude, longitude)}>Search</button>}
                {showThreeDayForecast && <button className="custom-button" onClick={resetData}>Reset</button>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherDetailsView;

