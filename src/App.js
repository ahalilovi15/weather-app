import logo from './logo.svg';
import React from 'react'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'weather-icons/css/weather-icons.css';
import Weather from './components/weather_component'
import Forecast from './components/forecast'
import Form from './components/form_component'
import { Component } from 'react';
const API_key='7c24c471fd78c7f4212f2d805f6715e8';
const API_key2 ='76de9c385163459b9dc123428210406';


class App extends React.Component{
  constructor(){
    super();
    this.state = {
      city: undefined,
      country: undefined,
      icon : undefined,
      main : undefined,
      celsius : undefined,
      temp_max : undefined,
      temp_min : undefined,
      description : "",
      error : false,
      forecast : undefined,
    };
    this.weatherIcon = {
      Thunderstorm : "wi-thunderstorm",
      Drizzle : "wi-sleet",
      Rain : "wi-storm-showers",
      Snow : "wi-snow",
      Atmosphere : "wi-fog",
      Clear : "wi-day-sunny",
      Clouds : "wi-day-fog"
    }
    
  }

  componentWillMount(){
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=sarajevo,ba&appid=${API_key}`)
      .then((response)=>response.json())
      .then((responseJson)=>{
        this.setState({
          city : `${responseJson.name}, ${responseJson.sys.country}`,
          celsius : this.calCelsius(responseJson.main.temp),
          temp_max : this.calCelsius(responseJson.main.temp_max),
          temp_min : this.calCelsius(responseJson.main.temp_min),
          description : responseJson.weather[0].description,
          error : false
        });
        this.getWeatherIcon(this.weatherIcon, responseJson.weather[0].id);
      });
    fetch(`http://api.openweathermap.org/data/2.5/forecast/?q=sarajevo&appid=${API_key}`)
      .then((response)=>response.json())
      .then((responseJson)=>{
        
        this.setState({
          forecast : responseJson.list
          .filter((f) => f.dt_txt.match(/09:00:00/))
          .map(mapDataToWeatherInterface)
        });
        
      })
     
    
    
  }
  calCelsius(temp){
    let cel = Math.floor(temp - 273.15);
    return cel;
  }
  mapDataToWeatherInterface (data){
    const mapped = {
      location: data.name,
      condition: data.cod,
      country: data.sys.country,
      date: data.dt * 1000, // convert from seconds to milliseconds
      description: data.weather[0].description,
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      icon_id: data.weather[0].id,
      sunrise: data.sys.sunrise * 1000, // convert from seconds to milliseconds
      sunset: data.sys.sunset * 1000, // convert from seconds to milliseconds
      temperature: Math.round(data.main.temp),
      timezone: data.timezone / 3600, // convert from seconds to hours
      wind_speed: Math.round(data.wind.speed * 3.6), // convert from m/s to km/h
    }
  
    // Add extra properties for the five day forecast: dt_txt, icon, min, max
    if (data.dt_txt) {
      mapped.dt_txt = data.dt_txt;
    }
  
    if (data.weather[0].icon) {
      mapped.icon = data.weather[0].icon;
    }
  
    if (data.main.temp_min && data.main.temp_max) {
      mapped.max = Math.round(data.main.temp_max);
      mapped.min = Math.round(data.main.temp_min);
    }
  
    // remove undefined fields
    Object.entries(mapped).map(
      ([key, value]) => value === undefined && delete mapped[key],
    );
   
    return mapped;
  }
  getWeatherIcon(icons, rangeId){
    switch(true){
      case rangeId >= 200 && rangeId <= 232:
        this.setState({icon: this.weatherIcon.Thunderstorm})
        break;
      case rangeId >= 300 && rangeId <= 321:
        this.setState({icon: this.weatherIcon.Drizzle})
        break;
      case rangeId >= 500 && rangeId <= 531:
        this.setState({icon: this.weatherIcon.Rain})
        break;
      case rangeId >= 600 && rangeId <= 622:
        this.setState({icon: this.weatherIcon.Snow})
        break;
      case rangeId >= 701 && rangeId <= 781:
        this.setState({icon: this.weatherIcon.Atmosphere})
        break;
      case rangeId === 800:
        this.setState({icon: this.weatherIcon.Clear})
        break;
      case rangeId >= 801 && rangeId <= 804:
        this.setState({icon: this.weatherIcon.Clouds})
        break;
      default:
        this.setState({icon: this.weatherIcon.Clouds})
      }
  }

  getWeather = async (e)=>{
    e.preventDefault();
    const city = e.target.elements.city.value;
    const country = e.target.elements.country.value;
    if(city && country) {
    const api_call = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_key}`
      );
    const response = await api_call.json();
    
    this.setState({
      city : `${response.name}, ${response.sys.country}`,
      celsius : this.calCelsius(response.main.temp),
      temp_max : this.calCelsius(response.main.temp_max),
      temp_min : this.calCelsius(response.main.temp_min),
      description : response.weather[0].description,
      error : false
    });
    this.getWeatherIcon(this.weatherIcon, response.weather[0].id);
  } else{
      this.setState({error: true});
  }

  
    const api_call_forecast = await fetch(
      `http://api.openweathermap.org/data/2.5/forecast/?q=${city}&appid=${API_key}`
    );
    const response_forecast = await api_call_forecast.json();
    
    this.setState({
      forecast : response_forecast.list
      .filter((f) => f.dt_txt.match(/09:00:00/))
      .map(mapDataToWeatherInterface)
    });
  };
 

  render(){
   
    
    return(
      
      <div className="App">
      
      <Form loadweather={this.getWeather} error={this.state.error}></Form>
      { this.state.forecast!=undefined &&
      <Weather className="card"
      city={this.state.city}
      country={this.state.country}
      temp_celsius={this.state.celsius}
      temp_max={this.state.temp_max}
      temp_min={this.state.temp_min}
      description={this.state.description}
      icon={this.state.icon}
      forecast={this.state.forecast}
      />
  }
     
    
    </div>
  
     );
  }
}



function mapDataToWeatherInterface(data) {
  const mapped = {
    location: data.name,
    condition: data.cod,
    country: data.sys.country,
    date: data.dt * 1000, // convert from seconds to milliseconds
    description: data.weather[0].description,
    feels_like: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    icon_id: data.weather[0].id,
    sunrise: data.sys.sunrise * 1000, // convert from seconds to milliseconds
    sunset: data.sys.sunset * 1000, // convert from seconds to milliseconds
    temperature: Math.round(data.main.temp),
    timezone: data.timezone / 3600, // convert from seconds to hours
    wind_speed: Math.round(data.wind.speed * 3.6), // convert from m/s to km/h
  };

  // Add extra properties for the five day forecast: dt_txt, icon, min, max
  if (data.dt_txt) {
    mapped.dt_txt = data.dt_txt;
  }

  if (data.weather[0].icon) {
    mapped.icon = data.weather[0].icon;
  }

  if (data.main.temp_min && data.main.temp_max) {
    mapped.max = Math.round(data.main.temp_max);
    mapped.min = Math.round(data.main.temp_min);
  }

  // remove undefined fields
  Object.entries(mapped).map(
    ([key, value]) => value === undefined && delete mapped[key],
  );
  
  return mapped;
}
function calCelsius(temp){
  let cel = Math.floor(temp - 273.15);
  return cel;
}
export default App;
