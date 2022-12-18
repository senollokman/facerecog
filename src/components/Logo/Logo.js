import React from "react";
//import ReactDOM from 'react-dom';
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import facerecoglogo from './facerecog.png'

const Logo = () => {
    return (
        <div className='ma4 mt0'>
            <Tilt className="Tilt br2 shadow-2" options={{max: 55}} style={{ height: '120px', width: '120px' }}>
                <div className="Tilt-inner pa3" >
                    <img style={{paddingTop: '10px'}} alt='logo' src={facerecoglogo}/>
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;