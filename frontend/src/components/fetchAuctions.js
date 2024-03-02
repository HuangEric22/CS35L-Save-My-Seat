import { useEffect, useState } from "react";

const MyAuctions = () => {
    const [auctions, setAuctions] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await fetch("http://localhost:4000/api/auction/", {
                    method: "GET", 
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch auctions');
                }

                const data = await response.json();
                setAuctions(data);
            } catch (error) {
                console.error(error);
                setError('Failed to fetch auctions. Please try again later.');
            }
        };

        fetchAuctions();
    }, []);

    return (
        <div>
            {error && <p>{error}</p>}
            {auctions.map(auction => (
                <p key = {auction._id}>{auction._id}</p>
            ))}
        </div>
    );
};

export default MyAuctions;
