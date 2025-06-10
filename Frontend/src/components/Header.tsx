import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleUser } from "@fortawesome/free-solid-svg-icons"

function Header() {
    return (
        <header className="header">
            <a href="/">
                <div className="titulo">
                    <img src="/TripPlanner.png" alt="Logo Trip Planner" className="logo" />
                    <h1>Trip Planner</h1>
                </div>
            </a>
            
            <a href="/usuario">
                <FontAwesomeIcon icon={faCircleUser} className="icon"/>
            </a>
        </header>
    )
}

export default Header