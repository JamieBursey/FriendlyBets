import { useState } from "react";

const ShowVideo = ({ video, setVideo }) => {
  if (!video) return null;
  return (
    <div className="bg-info video-container">
      <button className="video-close-button" onClick={() => setVideo(false)}>
        Close Video
      </button>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/YLslsZuEaNE?si=GbKbdYL4kRO-J06p"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};

const LandingPage = () => {
  return (
    <div className="mt-4">
      <div className="container my-4">
        <div className="row">
          <div className="col-md-6 text-white">
            <h3>Friendly Bets</h3>
            <h2 className="mt-4">Weclome To Friendly Bets!</h2>
          </div>

          <div className="col-md-6">
            <div className="video-container rounded bg-secondary">
              <iframe
                width="100%"
                height="315"
                src="https://www.youtube.com/embed/YLslsZuEaNE"
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      <div className="clearfix">
        <p className="text-white bg-secondary">Hello World!</p>
        <div className="float-end bg-white">
          <p>testing</p>
        </div>
      </div>
      <h2>Hello World2</h2>
    </div>
  );
};

export { LandingPage };
