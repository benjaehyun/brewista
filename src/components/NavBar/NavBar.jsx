// import { Link } from "react-router-dom"
// import * as userService from "../../utilities/users-service"

// export default function NavBar({user, setUser}) {

//     function handleLogOut() {
//         userService.logOut()
//         setUser(null)
//     }
//     return (
//         <nav>
//             <Link to="/orders">Order History</Link>
//             &nbsp; | &nbsp;
//             <Link to="/orders/new">New Order</Link>
//             &nbsp;  &nbsp;
//             <br />
//             <span> Welcome, {user.name} </span> 
//             &nbsp;  &nbsp; <Link to='' onClick={handleLogOut}>Log Out </Link>
//         </nav>
//     )
// }

// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
// import * as userService from '../../utilities/users-service';
// import ProtectedLink from '../../pages/App/ProtectedLink';


// export default function NavBar({ user, setUser, protectedNavigate }) {
//     const [isOpen, setIsOpen] = useState(false);

//     function handleLogOut() {
//         userService.logOut();
//         setUser(null);
//     }

//     function toggleMenu() {
//         setIsOpen(!isOpen);
//     }

//     return (
//         <nav className="bg-gray-800 p-3">
//             <div className="flex items-center justify-between">
//                 <Link to="/" className="text-white text-lg font-bold">Coffee Brew Tracker</Link>
//                 <button onClick={toggleMenu} className="text-white focus:outline-none md:hidden p-2 mr-2 ">
//                     <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
//                 </button>
//             </div>
//             <div className={`${isOpen ? 'block' : 'hidden'} md:flex`}>
//                 <Link to="/recipes" className="text-white block mt-2 md:inline-block md:mt-0">Recipes</Link>
//                 <ProtectedLink to="/myrecipes" isProtected={true} protectedNavigate={protectedNavigate}>
//                     Go to My Recipes
//                 </ProtectedLink>
//                 {user && (
//                     <>
//                         {/* <Link to="/myrecipes" className="text-white block mt-2 md:inline-block md:mt-0">My Recipes</Link> */}
//                         <span className="text-white block mt-2 md:inline-block md:mt-0">Welcome, {user.name}</span>
//                         <Link to='' onClick={handleLogOut} className="text-white block mt-2 md:inline-block md:mt-0">Log Out</Link>
//                     </>
//                 )}
//                 {!user && (
//                     <Link to="/auth" className="text-white block mt-2 md:inline-block md:mt-0">Login / Sign Up</Link>
//                 )}
//             </div>
//         </nav>
//     );
// }


import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import * as userService from '../../utilities/users-service';
import ProtectedLink from '../../pages/App/ProtectedLink';

export default function NavBar({ user, setUser, protectedNavigate }) { 
    const [isOpen, setIsOpen] = useState(false);

    function handleLogOut() {
        userService.logOut();
        setUser(null);
        setIsOpen(false);
    }

    function toggleMenu() {
        setIsOpen(!isOpen);
    }

    function closeMenu() {
        setIsOpen(false);
    }

    return (
        <nav className="bg-gray-800 p-3">
            <div className="flex items-center justify-between">
                <Link to="/" className="text-white text-lg font-bold" onClick={closeMenu}>Coffee Brew Tracker</Link>
                <button onClick={toggleMenu} className="text-white focus:outline-none md:hidden p-2 mr-2">
                    <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
                </button>
            </div>
            <div className={`${isOpen ? 'block' : 'hidden'} md:flex`}>
                <Link to="/recipes" className="text-white block mt-2 md:inline-block md:mt-0" onClick={closeMenu}>Recipes</Link>
                {/* Use ProtectedLink for the My Recipes link */}
                <ProtectedLink to="/myrecipes" isProtected={true} protectedNavigate={protectedNavigate} className="text-white block mt-2 md:inline-block md:mt-0" onClick={closeMenu}>
                    My Recipes
                </ProtectedLink>
                {user && (
                    <>
                        <Link to="/myrecipes" className="text-white block mt-2 md:inline-block md:mt-0">My Recipes</Link>
                        <span className="text-white block mt-2 md:inline-block md:mt-0">Welcome, {user.name}</span>
                        <Link to="" onClick={handleLogOut} className="text-white block mt-2 md:inline-block md:mt-0">Log Out</Link>
                    </>
                )}
                {!user && (
                    <Link to="/auth" className="text-white block mt-2 md:inline-block md:mt-0" onClick={closeMenu}>Login / Sign Up</Link>
                )}
            </div>
        </nav>
    );
}
