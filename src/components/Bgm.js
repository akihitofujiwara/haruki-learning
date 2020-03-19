import React, { Component, useRef, useEffect } from 'react';
import { useToggle, useLocation } from 'react-use';
import { Button } from 'reactstrap';

export default function Bgm (props) {
  const location = useLocation();
  const isAdmin = !!location.pathname.match(/^\/admin/);
  const audioEl = useRef(null);
  const [hasStarted, toggleStarted] = useToggle();
  const onClickStart = () => {
    audioEl.current && audioEl.current.play();
    toggleStarted();
  }

  return (
    <div className="app-page h-100">
      {
        isAdmin || hasStarted ? (
          props.children
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
          <audio src="https://vgmdownloads.com/soundtracks/super-mario-odyssey-ost/agmdyrlw/4-01%20Fossil%20Falls%20%288-Bit%29.mp3" ref={audioEl} loop />
        )
      }
    </div>
  );
};
