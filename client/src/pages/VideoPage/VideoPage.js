import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import './VideoPage.css'

const VideoPage = () => {
    const [queryParams] = useSearchParams();
    
    const navigate = useNavigate();
   
    return (
        <div className='content'>
            <div className='container'>
                <div className="back_button">
                    <a onClick={() => navigate(-1)}>
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="30" cy="30" r="30" fill="#DCDCDC"/>
                            <path d="M15.2954 29.2433C14.9036 29.6325 14.9015 30.2657 15.2907 30.6575L21.6331 37.0429C22.0223 37.4348 22.6555 37.4369 23.0473 37.0477C23.4392 36.6585 23.4413 36.0253 23.0521 35.6335L17.4144 29.9576L23.0903 24.3198C23.4821 23.9306 23.4842 23.2975 23.095 22.9056C22.7058 22.5138 22.0727 22.5117 21.6808 22.9009L15.2954 29.2433ZM44.0034 29.0472L16.0035 28.9528L15.9968 30.9528L43.9966 31.0472L44.0034 29.0472Z" fill="#898989"/>
                        </svg>
                    </a>
                    
                    <span>Назад </span>
                </div>
                <div className='video_container'>
                    <iframe  src={`https://vkvideo.ru/video_ext.php?oid=${queryParams.get('oid')}&id=${queryParams.get('id')}&hd=2&autoplay=true`} allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;" frameborder="0" allowfullscreen></iframe>
                </div>
                
            </div>
        </div>
        
    );
};

export default VideoPage;