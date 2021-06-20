import React from 'react';
import * as weatherIcons from '../icons';
import './forecast_style.css';
const Forecast=(props)=>{
    const icon = 'wi wi-'+
          weatherIcons.default['day'][props.icon].icon;
    return(
        <div className='forecast-weather'>
            <h5>{props.day}</h5>
            
            <h5 className='py-4'> 
            <i className={icon}></i>
            </h5> 
            <h5>
           <span className='px-2'>{props.temp_min}&deg;</span>
           <span className='px-2'>{props.temp_max}&deg;</span>
       </h5> 
        </div>
    );
};
export default Forecast;