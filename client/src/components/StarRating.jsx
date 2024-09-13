import React from 'react'
import { FaStar, FaStarHalf } from 'react-icons/fa';

const StarRating = ({ rating }) => {

    const stars = [];

    for (let i = 1; i <= 5; i++) {

        if (i <= rating) {
            stars.push(<span><FaStar key={i} style={{ color: '#8B54BF' }} className="inline-block" /></span>)
        }
        else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
            stars.push(<span><FaStarHalf key={i} style={{ color: '#8B54BF' }} className="inline-block" /></span>)
        }
        else {

            stars.push(<span><FaStar key={i} style={{ color: '#d7d7d7', }} className="inline-block" /></span>)

        }

    }



    return (
        <div className='text-slate-800
        '>

            {stars}

        </div>
    )
}

export default StarRating
