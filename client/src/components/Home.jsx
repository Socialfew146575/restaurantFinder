import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { FaLink, FaSpinner, FaStar, FaDollarSign } from "react-icons/fa";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "react-router-dom"
import StarRating from './StarRating';
const Home = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [restaurant, setRestaurant] = useState({
        name: "",
        location: "",
        priceRange: 0,
        averagerating : 0,
    });
    const [addLoading, setAddLoading] = useState(false);

    const fetchRestaurants = useCallback(async () => {
        try {
            const result = await axios.get(import.meta.env.VITE_REACT_APP_API_ROUTE);
            setRestaurants(result.data.restaurants);
            console.log(result.data)
          
        } catch (error) {
            console.error("Error fetching restaurants:", error);
            setError("Failed to load restaurants.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRestaurants();
    }, [fetchRestaurants]);

    const handleAddRestaurant = async () => {
        setAddLoading(true);
        try {
            await axios.post(import.meta.env.VITE_REACT_APP_API_ROUTE, restaurant);
            setRestaurant({
                name: "",
                location: "",
                priceRange: 0
            });
            fetchRestaurants(); // Refresh list after adding
        } catch (error) {
            console.error("Error Adding restaurant:", error);
            setError("Failed to add restaurant.");
        } finally {
            setAddLoading(false);
        }
    };

    const handleRestaurantDelete = async (id) => {
        setDeleteLoading(id);
        try {
            await axios.delete(`${import.meta.env.VITE_REACT_APP_API_ROUTE}/${id}`);
            fetchRestaurants(); // Refresh list after deleting
        } catch (error) {
            console.error("Error deleting restaurant:", error);
            setError("Failed to delete restaurant.");
        } finally {
            setDeleteLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-custom-gradient">
                <span className="loader"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-custom-gradient">
                <div className="bg-white text-red-600 text-xl font-semibold px-6 py-3 rounded-md shadow-lg">
                    <span className="inline-block animate-bounce mr-2">⚠️</span>
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="py-12 px-6 sm:px-12 lg:px-24 min-h-screen flex flex-col gap-12 items-center bg-custom-gradient font-serif">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl mt-4 text-white tracking-widest text-center">Restaurant Finder</h2>

            <div className="flex flex-col gap-8 w-full max-w-4xl shadow-lg p-6 sm:p-8 bg-white rounded-lg">
                <div className="flex flex-col sm:flex-row justify-between gap-8 sm:gap-4">
                    <div className="flex flex-col gap-3 flex-1">
                        <label htmlFor="name" className="text-sm text-gray-700 font-semibold">Restaurant Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Restaurant"
                            value={restaurant.name}
                            onChange={(e) => setRestaurant({ ...restaurant, name: e.target.value })}
                            className="p-3 rounded-md border border-gray-300 focus:border-customPurpleLight focus:ring-customPurpleLight focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-3 flex-1">
                        <label htmlFor="location" className="text-sm text-gray-700 font-semibold">Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            placeholder="City, State"
                            value={restaurant.location}
                            onChange={(e) => setRestaurant({ ...restaurant, location: e.target.value })}
                            className="p-3 rounded-md border border-gray-300 focus:border-customPurpleLight focus:ring-customPurpleLight focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-3 flex-1">
                        <label htmlFor="price" className="text-sm text-gray-700 font-semibold">Price Range</label>
                        <input
                            type="number"
                            min={1}
                            max={5}
                            id="price"
                            name="price"
                            value={restaurant.priceRange}
                            onChange={(e) => setRestaurant({ ...restaurant, priceRange: e.target.value })}
                            placeholder="1-5"
                            className="p-3 rounded-md border border-gray-300 focus:border-customPurpleLight focus:ring-customPurpleLight focus:outline-none"
                        />
                    </div>
                </div>

                <button
                    className="self-end bg-customPurpleLight text-white text-lg font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-md hover:bg-customPurpleDark transition duration-300 ease-in-out"
                    onClick={handleAddRestaurant}
                >
                    {addLoading ? <span><FaSpinner className='animate-spin' /> Adding...</span> : "Add"}
                </button>
            </div>

            {restaurants.length > 0 ? (
                <div className="flex flex-col gap-8 w-full max-w-6xl shadow-lg p-6 sm:p-8 bg-white rounded-lg">
                    <div className=" hidden md:flex justify-between border-b-2 pb-4 px-3">
                        <span className="text-center w-12">S.No</span>
                        <span className="flex-1 text-center">Name</span>
                        <span className="flex-1 text-center">Location</span>
                        <span className="flex-1 text-center">Price Range</span>
                        <span className="flex-1 text-center">Ratings</span>
                        <span className="flex-1 text-center">Actions</span>
                    </div>
                    {restaurants.map((restaurant, indx) => (
                        <div className="flex flex-col items-center  md:flex-row justify-between pb-4 px-3" key={restaurant.id}>
                            <span className="text-center w-12">{indx + 1}</span>
                            <span className="flex-1 text-center">{restaurant.name}</span>
                            <span className="flex-1 text-center">{restaurant.location}</span>
                            <span className="flex-1 text-center">
                                {[...Array(restaurant.price_range)].map((_, index) => (
                                    <FaDollarSign key={index} style={{ color: '#8B54BF' }} className="inline-block" />
                                ))}
                            </span> 
                            <span className="flex-1 text-center">
                               <StarRating rating={restaurant.averagerating}/>
                            </span>
                            <span className="flex-1 flex justify-center gap-4 items-center">
                                <Link to={`/restaurant/${restaurant.id}/update`} className="bg-customPurpleLight text-white h-fit px-3 py-1 rounded-md hover:bg-customPurpleDark transition">
                                    Edit
                                </Link>
                                <button
                                    className="bg-red-500 text-white px-3 h-fit py-1 rounded-md hover:bg-red-700 transition"
                                    onClick={() => handleRestaurantDelete(restaurant.id)}
                                >
                                    {deleteLoading === restaurant.id ? (
                                        <span className='flex gap-1 items-center'><FaSpinner className='animate-spin' /> Deleting...</span>
                                    ) : "Delete"}
                                </button>
                                <Link to={`/restaurant/${restaurant.id}`}><FaExternalLinkAlt color='#8B54BF' /></Link>
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[40vh] text-white text-2xl font-semibold">
                    <span className="loader mb-6"></span>
                    <p className="text-center text-lg sm:text-xl md:text-2xl">
                        No restaurants found. Start adding your favorite spots!
                    </p>
                    <p className="text-center text-sm sm:text-base text-gray-300 mt-2">
                        Your restaurant list is waiting to be filled with delicious places.
                    </p>
                </div>

            )}
        </div>
    );
};

export default Home;


