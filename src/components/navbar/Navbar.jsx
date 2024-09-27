import { Link } from "react-router-dom"
import './navbar.css'

export const Navbar = () => {
    return (
        <ul className='navbar'>
            <li><Link to='/' >Home</Link></li>
            <li><Link to='/allitems' >All Items</Link></li>
            <li><Link to='/createitem' >Create Item</Link></li>
            <li><Link to='/characterbuilder' >Character Builder</Link></li>
            <li><Link to='/profile' >Profile</Link></li>
            <li><Link to='/myaccount' >My Account</Link></li>
            {localStorage.getItem("capstone_user") ? (
            <li className="navbar-item navbar-logout">
              <Link
                className="navbar-link"
                to=""
                onClick={() => {
                  localStorage.removeItem("capstone_user");
                  navigate("/", { replace: true });
                }}
              >
                Logout
              </Link>
            </li>
          ) : (
            ""
          )}
        </ul>
    )
}