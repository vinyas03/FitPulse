import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ExerciseForm from "../components/ExerciseForm";
import ExerciseItem from "../components/ExerciseItem";
import Spinner from "../components/Spinner";
//import { getGoals, reset } from "../features/goals/goalSlice";

function Findworkout() {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  const [exercises, setResponseData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <section className="heading">
        <h1>Welcome {user && user.name}</h1>
        <p>Find new workouts</p>
      </section>

      <ExerciseForm
        setResponseData={setResponseData}
        setIsLoading={setIsLoading}
      />

      <section className="content">
        {isLoading && <Spinner />}
        {exercises.length > 0 ? (
          <div className="goals">
            {exercises.map((exercise) => (
              <ExerciseItem exercise={exercise} />
            ))}
          </div>
        ) : (
          <h3>You have not searched any workouts.</h3>
        )}
      </section>
    </>
  );
}

export default Findworkout;
