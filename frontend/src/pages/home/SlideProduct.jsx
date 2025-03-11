import React from 'react'
import { Link } from 'react-router-dom'

const SlideProduct = ({ slideHeading, product }) => {
  return (
    <Link to={`/products/${product._id}`}>
        <div className='flex flex-col items-center gap-1 py-4 justify-center cursor-pointer'>
            <div className='flex flex-col justify-center items-center w-32 hover:scale-105'>
              <img 
              src={product.url} 
              alt="" 
              className='h-36' 
              loading="lazy" 
            />
            </div>
            <span className=' text-sm mt-3'>{slideHeading === "Deals of the Day" ? product.category : product.brand}</span>
            <span className='text-green-600'>{product.discount !== '0' && product.discount}</span>
            <span className='text-gray-500 text-sm'>{product.tagline || product.name.split(' ').slice(0,3).join(' ')}</span>
        </div>
    </Link>
  )
}

export default SlideProduct