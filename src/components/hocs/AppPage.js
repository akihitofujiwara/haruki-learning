import React, { Component, useRef, useEffect } from 'react';
import { useToggle } from 'react-use';
import { Button } from 'reactstrap';

import HeaderNav from '../HeaderNav';

export default function AdminPageHOC(WrappedComponent) {
  return function AdminPage (props) {
    const audioEl = useRef(null);
    const [hasStarted, toggleStarted] = useToggle();
    const onClickStart = () => {
      audioEl.current && audioEl.current.play();
      toggleStarted();
    }

    return (
      <div className="app-page h-100">
        {
          hasStarted ? (
            <div
              className="h-100 d-flex flex-column"
              style={{
                backgroundImage: 'url(https://i0.wp.com/angry-mhm.com/wp-content/uploads/2017/10/SuperMarioOdyssey1.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundColor: 'rgba(255,255,255,0.8)',
                backgroundBlendMode: 'lighten',
              }}
            >
              <HeaderNav {...props} />
              <div className="flex-grow-1 p-5">
                <WrappedComponent {...props} />
              </div>
            </div>
          ) : (
            <div className="h-100 d-flex justify-content-center align-items-center">
              <Button size="lg" color="primary" onClick={onClickStart} style={{ fontSize: 60 }}>
                スタート
              </Button>
            </div>
          )
        }
        {
          (process.env.REACT_APP_ENV || 'development') === 'production' && (
            <audio src="https://vgmdownloads.com/soundtracks/super-mario-odyssey-ost/agmdyrlw/4-01%20Fossil%20Falls%20%288-Bit%29.mp3" ref={audioEl} controls />
          )
        }
      </div>
    );
  };
};

