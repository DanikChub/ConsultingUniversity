import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const ViewVideo = () => {
    const [queryParams] = useSearchParams();
    
   
    return (
        <div className='content'>
            <div className='container'>
            <iframe src={queryParams.get("link")+'&id='+queryParams.get('id')+'&hd=2&autoplay=1'} width="1100" height="620" allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;" frameborder="0" allowfullscreen></iframe>
            </div>
        </div>
        
    );
};

export default ViewVideo;