import { FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { IoFastFoodOutline } from "react-icons/io5";
import { GiWeightLiftingUp } from "react-icons/gi";

import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  return (
    <header className="header">
      <div className="logo ">
        <Link to="/">
          <h2>FitPulse</h2>
          <img src="logo.png" alt="FitPulse logo"/>
        </Link>
      </div>
      <ul>
        {user ? (
          <>
            <li>
              <Link to="/foodscan">
                <IoFastFoodOutline className="toolIcon" /> Food Scanner
              </Link>
            </li>
            <li>
              <Link to="/findworkout">
                <GiWeightLiftingUp className="toolIcon" /> Find Workout
              </Link>
            </li>
            <li>
              <button className="btn" onClick={onLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">
                <FaSignInAlt /> Login
              </Link>
            </li>
            <li>
              <Link to="/register">
                <FaUser /> Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;
