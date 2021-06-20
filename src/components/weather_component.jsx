import React from 'react';
import './weather_style.css';
import Forecast from './forecast.jsx'
const Weather=(props)=>{
    console.log(props.forecast);
    console.log(props);
    return(
        <div className="container">
            <div className='today'>
            <div className='cards pt-4'>
                <h1>{props.city}{props.country}</h1>
                
                {props.temp_celsius ?
                (<h1 className='py-2'>{props.temp_celsius}&deg;</h1>) : null}
                {minmaxTemp(props.temp_min,props.temp_max)}
                <h4 className='py-3'>{props.description}</h4>
                </div>
                    <div className='icon'>
                    <h5 className='py-4'> 
                <i className={`wi ${props.icon} display-1`}></i>
                </h5> 
                    </div>
                    </div>
                <div class="flex-forecast">
                {

                 props.forecast.map((weather)=>{
                     console.log(weather);
                     var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                     var d = new Date(weather.dt_txt.replace(" ", "T"));
                     var dayName = days[d.getDay()];
                     
                     return <Forecast
                     day={dayName}
                     temp_max={calCelsius(weather.max)}
                     temp_min={calCelsius(weather.min)}
                     icon={weather.icon_id}
                     />
                   
                })
                }
             </div>
            
        </div>
    );
};
function minmaxTemp(min,max){
    if(min && max){
    return (
       <h3>
           <span className='px-4'>{min}&deg;</span>
           <span className='px-4'>{max}&deg;</span>
       </h3> 
    );
    }
}
function calCelsius(temp){
    let cel = Math.floor(temp - 273.15);
    return cel;
  }
export default Weather;