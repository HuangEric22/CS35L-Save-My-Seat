import { Link } from 'react-router-dom';

const Bar = () => {
    return (
        <header>
            <div className="contain">
                <Link to= "/">
                    <h1>Save My Seat</h1>
                </Link>
            </div>
        </header>
    )
    
}

export default Bar;