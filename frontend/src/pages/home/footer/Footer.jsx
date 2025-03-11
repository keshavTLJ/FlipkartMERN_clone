import React from 'react'
// import '../footer/footer.css'

const Footer = () => {


  return (
    <div className="footermain bg-[#172337] w-full flex flex-col">
        <div className="upperfootersub flex flex-row py-10">
            <div className="upperfootersubleft flex flex-row justify-evenly w-[54%]">
                <ul className='flex flex-col gap-2'>
                    <li className='text-white/40 text-[12px] mb-1'>ABOUT</li>
                    <li className='text-white text-xs cursor-pointer hover:underline'>Contact Us</li>
                    <li className='text-white text-xs cursor-pointer hover:underline'>About us</li>
                    <li className='text-white text-xs cursor-pointer hover:underline'>Careers</li>
                    <li className='text-white text-xs cursor-pointer hover:underline'>Flipkart Stories</li>
                    <li className='text-white text-xs cursor-pointer hover:underline'>Press</li>
                    <li className='text-white text-xs cursor-pointer hover:underline'>Flipkart Wholesale</li>
                    <li className='text-white text-xs cursor-pointer hover:underline'>Corporate Information</li>
                </ul>

                <ul className='flex flex-col gap-2'>
                    <li className='text-white/40 text-[12px] mb-1'>HELP</li>
                    <li className='text-white text-xs cursor-pointer hover:underline'>Payments</li>
                    <li className='text-white text-xs cursor-pointer hover:underline'>Shipping</li>
                    <li className='text-white text-xs cursor-pointer hover:underline'>Cancellation & Returns</li>
                    <li className='text-white text-xs cursor-pointer hover:underline'>FAQ</li>
                    <li className='text-white text-xs cursor-pointer hover:underline'>Report Infringement</li>
                </ul>

                <ul className='flex flex-col gap-2'>
                    <li className='text-white/40 text-[12px] mb-1'>CONSUMER POLICY</li>
                    <li className='text-white text-xs cursor-pointer hover:underline'>Return Policy</li>
                    <li className='text-white text-xs cursor-pointer hover:underline'>Terms Of Use</li>
                    <li className='text-white text-xs cursor-pointer hover:underline'>Security</li>
                    <li className='text-white text-xs cursor-pointer hover:underline'>Privacy</li>
                    <li className='text-white text-xs cursor-pointer hover:underline'>Sitemap</li>
                    <li className='text-white text-xs cursor-pointer hover:underline'>Grievance Redressal</li>
                    <li className='text-white text-xs cursor-pointer hover:underline'>EPR Compliance</li>

                </ul>
                <ul className='flex flex-col gap-2'>
                    <li className='text-white/40 text-[12px] mb-1'>SOCIAL</li>
                    <li className='text-white text-xs cursor-pointer hover:underline'>Facebook</li>
                    <li className='text-white text-xs cursor-pointer hover:underline'>Twiter</li>
                    <li className='text-white text-xs cursor-pointer hover:underline'>YouTube</li>
                </ul>   
            </div>
            <div className="upperfootersubright flex flex-row justify-evenly w-[40%]">
                <ul className='flex flex-col gap-2 w-[45%] h-[75%] border-l-[1px] border-l-[#ffffff2d] pl-6'>
                    <li className='text-white/40 text-[12px] mb-1'>Mail Us:</li>
                    <li className='text-white text-xs leading-[18px]'>
                        Flipkart Internet Private Limited,<br />
                        Buildings Alyssa, Begonia &<br />
                        Clove Embassy Tech Village,<br />
                        Outer Ring Road, Devarabeesanahalli Village,
                        Bengaluru, 560103,<br />
                        Karnataka, India
                    </li>
                </ul>
                
                <ul className='flex flex-col gap-2 w-[36%]'>
                    <li className='text-white/40 text-[12px] mb-1'>Registered Office Address:</li>
                    <li className='text-white text-xs leading-[18px] flex flex-col'>
                        <span>Flipkart Internet Private Limited,</span>
                        <span>Buildings Alyssa, Begonia &</span>
                        <span>Clove Embassy Tech Village,</span>
                        <span>Outer Ring Road, Devarabeesanahalli Village,</span>
                        <span>Bengaluru, 560103,</span>
                        <span>Karnataka, India</span>
                        <span>CIN : U51109KA2012PTC066107</span>
                        <span>Telephone: <span className='text-blue-600 cursor-pointer'>044-45614700</span></span>
                    </li>
                </ul>
            </div>
        </div>
        <div className="divhr border-b-[1px] border-b-[#ffffff2d]"></div>
        <br />
        <div className="lowerfootersub my-4"></div>
            
    </div>
  )
}

export default Footer