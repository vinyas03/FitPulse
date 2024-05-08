//import { useDispatch } from 'react-redux'

function ExerciseItem({ exercise }) {
  //const dispatch = useDispatch()

  return (
    <div className="goal">
      <h2>{exercise.name}</h2>
      <h3>{exercise.muscle}</h3>
      <h3>{exercise.difficulty}</h3>
      <p>{exercise.instructions}</p>
    </div>
  );
}

export default ExerciseItem;
