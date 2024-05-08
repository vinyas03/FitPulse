import { useState } from "react";
//import { useDispatch } from "react-redux";

import axios from 'axios';

// REACT_APP_API_URL env variable for Production, otherwise for Development set up a proxy in package.json for development
const apiUrl = process.env.REACT_APP_API_URL || '';

function ExerciseForm({ setResponseData, setIsLoading }) {
  const [text, setText] = useState("");

  //const dispatch = useDispatch();
  

  const fetchWorkout = (text) => {
    axios
    .post(`${apiUrl}/api/workoutfind`, { text })
    .then((response) => {
      setResponseData(response.data);
      setIsLoading(false);
    })
    .catch((error) => {
      console.error('Error sending text to server:', error);
      setIsLoading(false);
    });
  }

  const onSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetchWorkout(text);
    setText("");
  };

  
  return (
    <section className="form">
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="text">Enter a muscle name:</label>
          <input
            type="text"
            name="text"
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="form-group">
          <button className="btn btn-block" type="submit">
            Search
          </button>
        </div>
      </form>
    </section>
  );
}

export default ExerciseForm;
