import React, { useCallback, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaLink, FaSpinner, FaStar, FaArrowLeft } from "react-icons/fa";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import StarRating from './StarRating';

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState(null)
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [showDropDown, setShowDropDown] = useState(false)
  const [addLoading, setAddLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0)

  const [review, setReview] = useState({
    name: "",
    review: ""
  })

  const handleRatingSelect = (rating) => {
    setSelectedRating(rating);
    setShowDropDown(false)

  };
  const [restaurant, setRestaurant] = useState({
    name: "",
    location: "",
    priceRange: 0
  });

  const scrollRef = useRef(null);

  // Function to handle horizontal scrolling
  const scroll = (direction) => {
    const { current } = scrollRef;
    if (direction === 'left') {
      current.scrollBy({ left: -300, behavior: 'smooth' });
    } else {
      current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const fetchRestaurant = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_REACT_APP_API_ROUTE}/${id}`);
      console.log(data);
      setRestaurant({
        name: data.restaurant.name,
        location: data.restaurant.location,
        priceRange: data.restaurant.price_range
      });
      setAverageRating(data.averageRating.averagerating)
      setReviews(data.reviews)
    } catch (error) {
      console.log(`Error Fetch restaurant with id : ${id}`, error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [id]);




  useEffect(() => {
    fetchRestaurant();

  }, [id, fetchRestaurant]);


  console.log(review)

  const handleAddReview = useCallback(async () => {
    setAddLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_REACT_APP_API_ROUTE}/${id}/addReview`, {
        name: review.name,
        review: review.review,
        rating: selectedRating

      });

      setReview({
        name: "",
        review: ""
      })
      handleRatingSelect(0)
      fetchRestaurant()
    } catch (error) {
      console.log(`Error Posting review : ${id}`, error);
    } finally {
      setAddLoading(false);
    }



  }, [id, review, selectedRating, fetchRestaurant])


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
      <div className='flex gap-3 flex-col mt-4 items-center'>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl text-white tracking-widest text-center">{restaurant.name}</h2>
        <h2 className="text-lg sm:text-xl lg:text-xl text-white tracking-widest text-center">{restaurant.location}</h2>
        <StarRating rating={averageRating} />
      </div>

      <div className="relative w-full">
        {/* Scrollable container */}
        <div
          ref={scrollRef}
          className="flex justify-center overflow-x-auto w-full snap-x snap-mandatory scrollbar-hidden gap-4 "
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {reviews.length >0 ?  reviews.map((review) => {
            return <ReviewCard key={review.id} review={review} />
          }) : <h2 className='text-center text-4xl text-white'>No Reviews Yet ! Be the first one to review your favourite Restaurant.</h2> }

        </div>

        {/* Navigation Buttons */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-10 top-1/2 w-8 h-8 items-center font-semibold flex justify-center transform -translate-y-1/2 bg-white text-[#8B54BF] p-2 rounded-full"
        >
          ←
        </button>

        <button
          onClick={() => scroll('right')}
          className="absolute -right-10 top-1/2 w-8 h-8 items-center font-semibold flex justify-center transform -translate-y-1/2 bg-white text-[#8B54BF] p-2 rounded-full"
        >
          →
        </button>
      </div>

      <div className="flex flex-col gap-8 w-full max-w-4xl shadow-lg p-6 sm:p-8 bg-white rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between gap-8 sm:gap-4 w-full">
          <div className="flex flex-col gap-3 flex-1">
            <label htmlFor="name" className="text-sm text-gray-700 font-semibold">Name</label>
            <input
              type="text"
              id="name"
              value={review.name}
              onChange={(e) => setReview({ ...review, name: e.target.value })}
              name="name"
              placeholder="Name"

              className="p-3 rounded-md border border-gray-300 focus:border-customPurpleLight focus:ring-customPurpleLight focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label htmlFor="rating" className="text-sm text-gray-700 font-semibold">Rating</label>
            <div className="relative">
              <button
                className="p-3 rounded-md border text-gray-700 border-gray-300 bg-white focus:border-customPurpleLight focus:ring-customPurpleLight focus:outline-none w-full text-left"
                onClick={() => setShowDropDown(true)}
              >
                {selectedRating ? (
                  <StarRating rating={selectedRating} />
                ) : (
                  'Select your rating'
                )}
              </button>
              {showDropDown && <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <div
                    key={rating}
                    className="p-2 hover:bg-gray-200 cursor-pointer flex items-center"
                    onClick={() => handleRatingSelect(rating)}
                  >
                    <StarRating rating={rating} />
                  </div>
                ))}
              </div>}
            </div>
          </div>


        </div>

        <div className="flex flex-col gap-3 flex-1">
          <label htmlFor="price" className="text-sm text-gray-700 font-semibold">Review</label>
          <textarea
            value={review.review}
            onChange={(e) => setReview({ ...review, review: e.target.value })}
            placeholder="Review"
            className="p-3 rounded-md border border-gray-300 focus:border-customPurpleLight focus:ring-customPurpleLight focus:outline-none"
          />
        </div>

        <div className='self-end flex gap-4'>
          <Link to={`/`} className=" border-2 bg-transparent text-black border-customPurpleLight w-fit h-fit px-3 flex items-center gap-2 py-1 rounded-md ">
            <FaArrowLeft />   Go back to Home
          </Link>
          <button
            className=" bg-customPurpleLight text-white text-lg font-semibold px-3 py-1 rounded-md hover:bg-customPurpleDark transition duration-300 ease-in-out"
            onClick={handleAddReview}
          >
            {addLoading ? <span className="flex items-center gap-2"><FaSpinner className='animate-spin' /> Adding...</span> : "Add"}
          </button>
        </div>
      </div>


    </div>
  );
}

export default RestaurantDetailPage;


const ReviewCard = ({ review }) => {
  console.log(review.name, review.rating, review.review)
  return (
    <div className="flex flex-shrink-0  w-[calc((100%-30px)/3)] snap-start h-full">



      <div className="flex flex-col gap-8 h-48 overflow-hidden  shadow-lg p-2  bg-white rounded-lg w-full">
        <div className='flex justify-between'>

          <h2 >{review.name}</h2>
          <StarRating rating={review.rating} />

        </div>
        {review.review}
      </div>
    </div>
  )


}
