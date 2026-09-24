import { Link } from 'react-router';
import logo from '../../assets/logo.png';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-black border-b border-black shadow-2xl">
      <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="font-bold text-orange-500 text-xl">
            <Link to='/'>
              <img className='w-40' src={logo} alt='logo'/>
            </Link>
          </div>
          <div className="flex gap-5 text-neutral-400">
            <Link to="/" className="hover:text-white transition flex items-center gap-1">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                height="20px" 
                viewBox="0 -960 960 960" 
                width="20px" 
                fill="#e3e3e3"><path d="M213-213.21q-21-21.21-21-51T213.21-315q21.21-21 51-21T315-314.79q21 21.21 21 51T314.79-213q-21.21 21-51 21T213-213.21Zm216 0q-21-21.21-21-51T429.21-315q21.21-21 51-21T531-314.79q21 21.21 21 51T530.79-213q-21.21 21-51 21T429-213.21Zm216 0q-21-21.21-21-51T645.21-315q21.21-21 51-21T747-314.79q21 21.21 21 51T746.79-213q-21.21 21-51 21T645-213.21Zm-432-216q-21-21.21-21-51T213.21-531q21.21-21 51-21T315-530.79q21 21.21 21 51T314.79-429q-21.21 21-51 21T213-429.21Zm216 0q-21-21.21-21-51T429.21-531q21.21-21 51-21T531-530.79q21 21.21 21 51T530.79-429q-21.21 21-51 21T429-429.21Zm216 0q-21-21.21-21-51T645.21-531q21.21-21 51-21T747-530.79q21 21.21 21 51T746.79-429q-21.21 21-51 21T645-429.21Zm-432-216q-21-21.21-21-51T213.21-747q21.21-21 51-21T315-746.79q21 21.21 21 51T314.79-645q-21.21 21-51 21T213-645.21Zm216 0q-21-21.21-21-51T429.21-747q21.21-21 51-21T531-746.79q21 21.21 21 51T530.79-645q-21.21 21-51 21T429-645.21Zm216 0q-21-21.21-21-51T645.21-747q21.21-21 51-21T747-746.79q21 21.21 21 51T746.79-645q-21.21 21-51 21T645-645.21Z"/>
              </svg>
              Dashboard
            </Link>
            <Link to="/vehicles" className="hover:text-white transition flex items-center gap-1">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                height="20px" 
                viewBox="0 -960 960 960" 
                width="20px" 
                fill="#e3e3e3"><path d="M168-96q-29.7 0-50.85-21.15Q96-138.3 96-168v-624q0-29.7 21.15-50.85Q138.3-864 168-864h624q29 0 50.5 21.15T864-792v624q0 29.7-21.5 50.85Q821-96 792-96H168Zm0-72h624v-624H168v624Zm178.5-238.29q-10.5-10.29-10.5-25.5t10.29-25.71q10.29-10.5 25.5-10.5t25.71 10.29q10.5 10.29 10.5 25.5t-10.29 25.71q-10.29 10.5-25.5 10.5t-25.71-10.29Zm216 0q-10.5-10.29-10.5-25.5t10.29-25.71q10.29-10.5 25.5-10.5t25.71 10.29q10.5 10.29 10.5 25.5t-10.29 25.71q-10.29 10.5-25.5 10.5t-25.71-10.29ZM240-504v216q0 10.5 6.75 17.25T264-264h24q11.38 0 18.69-7 7.31-7 5.31-17v-24h336v24q0 10.94 7 17.97 7 7.03 17 6.03h24q10-1 17-7.47t7-16.53v-216l-59-160q-6-14-18.12-23-12.12-9-26.88-9H345q-14.76 0-26.88 8.5T300-665l-60 161Zm95-48 27-72h238l26 72H335ZM168-792v624-624Zm144 408v-96h336v96H312Z"/>
              </svg>
              My Vehicles
            </Link>
            <Link to="/logService" className="hover:text-white transition flex items-center gap-1">
              <svg 
                xmlns="http://http://www.w3.org/2000/svg" 
                height="20px" 
                viewBox="0 -960 960 960" 
                width="20px" 
                fill="#e3e3e3"><path d="M748-144 531-361l68-68 217 217-68 68Zm-536 0-68-68 268-268-64-64-38 38-52-52v70l-26 26-112-112 26-26h70l-36-37 144-144q17-17 38.5-26t45.5-9q24 0 45.5 9t38.5 26l-87 86 47 47-36 36 64 64 83-83q-5-13-8-26t-3-27q0-55 38.5-93.5T684-816q14 0 27 3t26 8l-87 87 68 68 87-87q6 12 8.5 25.5T816-684q0 55-38.5 93T684-553q-14 0-27-2.5t-26-8.5L212-144Z"/>
              </svg>
              Log Service
            </Link>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-300 font-medium">
              👋 {user.name}
            </span>
            <button
              onClick={onLogout}
              className="text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}