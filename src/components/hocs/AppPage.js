import React, { Component } from 'react';

import HeaderNav from '../HeaderNav';

export default function AdminPageHOC(WrappedComponent) {
  const audioIframeHtml = '<iframe src="https://vgmdownloads.com/soundtracks/super-mario-odyssey-ost/agmdyrlw/4-01%20Fossil%20Falls%20%288-Bit%29.mp3" allow="autoplay" id="audio" style="display:none"></iframe>';

  return function AdminPage (props) {
    return (
      <div
        className="app-page h-100"
        style={{
          backgroundImage: 'url(https://i0.wp.com/angry-mhm.com/wp-content/uploads/2017/10/SuperMarioOdyssey1.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundColor: 'rgba(255,255,255,0.8)',
          backgroundBlendMode: 'lighten',
        }}>
        <div className="h-100 d-flex flex-column">
          <HeaderNav {...props} />
          <div className="flex-grow-1 p-5">
            <WrappedComponent {...props} />
          </div>
        </div>
        {
          (process.env.REACT_APP_ENV || 'development') === 'production' && (
            <div dangerouslySetInnerHTML={{ __html: audioIframeHtml }} />
          )
        }
      </div>
    );
  };
};

