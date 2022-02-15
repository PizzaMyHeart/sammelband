import { Link } from 'react-router-dom';
import aboutIcon from '../icons/help-circle.svg';
import homeIcon from '../icons/home.svg';
import donateIcon from '../icons/dollar-sign.svg';

function Navbar() {
    return (
        <nav>
            <li><Link to="/"><img src={ homeIcon } alt="Home icon" /></Link></li>
            <li><Link to="/about"><img src={ aboutIcon } alt="About icon" /></Link></li>
            <li><Link to="/donate"><img src={ donateIcon } alt="Donate icon" /></Link></li>
        </nav>
    )
}

export default Navbar;