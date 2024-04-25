//import { useDispatch } from 'react-redux'

function ExerciseItem({ exercise }) {
  //const dispatch = useDispatch()

  return (
    <div className="goal">
      <h2>{exercise.Muscles}</h2>
      <h3>{exercise.WorkOut}</h3>
      <p>{exercise["Long Explanation"]}</p>
    </div>
  );
}

export default ExerciseItem;
