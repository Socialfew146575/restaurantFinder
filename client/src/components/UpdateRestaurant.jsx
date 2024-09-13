import axios from 'axios';
import { useCallback, useEffect, useState } from 'react'
import { FaSpinner, FaArrowLeft } from "react-icons/fa";
import { useParams, Link } from 'react-router-dom';

const UpdateRestaurant = () => {
  const [restaurant, setRestaurant] = useState({
    name: "",
    location: "",
    priceRange: 0
  });
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editLoading, setEditLoading] = useState(false)
  const { id } = useParams()

  const fetchRestaurant = useCallback(async () => {

    setLoading(true)

    try {



      const { data } = await axios.get(`${import.meta.env.VITE_REACT_APP_API_ROUTE}/${id}`)
      console.log(data)
      setRestaurant({
        name: data.restaurant.name,
        location: data.restaurant.location,
        priceRange: data.restaurant.price_range
      })

    } catch (error) {
      console.log(`Error Fetch restaurant with id : ${id}`, error)

      setError(error)

    } finally {
      setLoading(false)
    }




  }, [])

  console.log(restaurant, id)


  useEffect(() => {

    fetchRestaurant()

  }, [id, fetchRestaurant])


  const handleEdit = async () => {
    setEditLoading(true)
    try {

       await axios.put(`${import.meta.env.VITE_REACT_APP_API_ROUTE}/${id}`, restaurant)
      
        fetchRestaurant()


    } catch (error) {
      console.log(`Error Updating restaurant with id : ${id}`, error)

      setError(error)

    } finally {
      setEditLoading(false)
    }



  }


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

        <div className='self-end flex gap-4'>
          <Link to={`/`} className=" border-2 bg-transparent text-black border-customPurpleLight w-fit h-fit px-3 flex items-center gap-2 py-1 rounded-md ">
            <FaArrowLeft />   Go back to Home
          </Link>
          <button
            className=" bg-customPurpleLight text-white text-lg font-semibold px-3 py-1 rounded-md hover:bg-customPurpleDark transition duration-300 ease-in-out"
            onClick={handleEdit}
          >
            {editLoading ? <span className='flex gap-2 items-center'><FaSpinner className='animate-spin' /> Editing...</span> : "Edit"}
          </button>
        </div>
      </div>


    </div>
  )
}

export default UpdateRestaurant
