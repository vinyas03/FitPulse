
import React, { useState } from 'react';
import axios from 'axios';
import Tesseract from 'tesseract.js';

const Foodscan = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState('');
  const [progress, setProgress] = useState(0);
  const [responseText, setResponseText] = useState('');

  const handleSubmit = () => {
    setIsLoading(true);
    Tesseract.recognize(image, 'eng', {
      logger: (m) => {
        console.log(m);
        if (m.status === 'recognizing text') {
          setProgress(parseInt(m.progress * 100));
        }
      },
    })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      })
      .then((result) => {
        console.log(result.data);
        sendTextToServer(result.data.text);
      });
  };

  const sendTextToServer = (text) => {
    axios
      .post('/api/scanfood', { text })
      .then((response) => {
        console.log('Response from server:', response.data);
        setResponseText(response.data.result);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error sending text to server:', error);
        setIsLoading(false);
      });
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(URL.createObjectURL(selectedImage));
  };

  const isImageSelected = image !== '';

  return (
    <div className="container" style={{ height: '100vh' }}>
      <div className="row h-100">
        <div className="col-md-5 mx-auto h-100 d-flex flex-column justify-content-center">
          {!isLoading && (
            <h2 className="text-center py-5 mc-5">Upload image of food labels/ingredients for analysis.</h2>
          )}
          {isLoading && progress > 0 && (
            <>
              <progress className="form-control" value={progress} max="100">
                {progress}%{' '}
              </progress>{' '}
              <p className="text-center py-0 my-0">Sending: {progress}%. Please wait for a while.</p>
            </>
          )}
          {!isLoading && (
            <>
              <input
                type="file"
                onChange={handleImageChange}
                className="form-control mt-5 mb-2"
              />
              <input
                type="button"
                onClick={handleSubmit}
                className="btn btn-primary mt-5"
                value="Send"
                disabled={!isImageSelected} // Disable the button if no image is selected
              />
            </>
          )}
          {responseText && (
            <div className="mt-3">
              <h3>Results:</h3>
              <p>{responseText}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Foodscan;
