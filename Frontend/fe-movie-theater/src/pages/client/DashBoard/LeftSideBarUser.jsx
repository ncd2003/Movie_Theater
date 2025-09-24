import React from "react";
import { Link, useLocation } from "react-router-dom";

function LeftSideBarUser() {
  const location = useLocation(); // lấy đường dẫn hiện tại

  const menuItems = [
    { to: "/customer/account-edit", label: "ACCOUNT DETAILS" },
    { to: "/customer/change-password", label: "CHANGE PASSWORD" },
    { to: "/customer/history", label: "HISTORY" },
    { to: "/customer/booked-ticket", label: "BOOKED TICKET" },
  ];

  return (
    <ul className="flex-[2] mt-3 ">
      <li className="text-2xl my-1 text-red-500 font-semibold">ACCOUNT CGV</li>

      {menuItems.map((item, index) => (
        <Link key={index} to={item.to} className="flex items-center mt-2">
          <img
            src={
              location.pathname === item.to
                ? "https://www.cgv.vn/skin/frontend/cgv/default/images/bg-cgv/ribon_left.png"
                : "https://www.cgv.vn/skin/frontend/cgv/default/images/bg-cgv/ribon_left-ccc.png"
            }
          />
          <span
            className={`py-[4.91px] px-2 text-left w-2/3 font-medium ${
              location.pathname === item.to
                ? "bg-[#e71a0f] text-white"
                : "bg-[#ccc]"
            }`}
          >
            {item.label}
          </span>
        </Link>
      ))}
    </ul>
  );
}

export default LeftSideBarUser;

{
  /* <ul className='flex-[2] mt-3 '>
<li className='text-2xl my-1 text-red-500 font-semibold'>
  ACCOUNT CGV
</li>
<Link to={`/customer/account`} className='flex items-center'>
  <img src='https://www.cgv.vn/skin/frontend/cgv/default/images/bg-cgv/ribon_left-ccc.png' />
  <span className='bg-[#ccc] py-[4.91px] px-2 text-left w-2/3 font-medium '>
  GENERAL INFORMATION
  </span>
</Link>

<Link
  to={`/customer/account-edit`}
  className='flex items-center mt-2'
>
 <img src='https://www.cgv.vn/skin/frontend/cgv/default/images/bg-cgv/ribon_left.png' />
  <span className='bg-[#e71a0f] py-[4.91px] px-2 text-left w-2/3 font-medium text-white'>
    ACCOUNT DETAIL
  </span>
</Link>

<Link
  to={`/customer/change-password`}
  className='flex items-center mt-2'
>
  <img src='https://www.cgv.vn/skin/frontend/cgv/default/images/bg-cgv/ribon_left-ccc.png' />
  <span className='bg-[#ccc] py-[4.91px] px-2 text-left w-2/3 font-medium '>
    CHANGE PASSWORD
  </span>
</Link>

<Link to={`/customer/history`} className='flex items-center mt-2'>
  <img src='https://www.cgv.vn/skin/frontend/cgv/default/images/bg-cgv/ribon_left-ccc.png' />
  <span className='bg-[#ccc] py-[4.91px] px-2 text-left w-2/3 font-medium '>
    HISTORY
  </span>
</Link>

<Link
  to={`/customer/booked-ticket`}
  className='flex items-center mt-2 mb-6'
>
  <img src='https://www.cgv.vn/skin/frontend/cgv/default/images/bg-cgv/ribon_left-ccc.png' />
  <span className='bg-[#ccc] py-[4.91px] px-2 text-left w-2/3 font-medium '>
    BOOKED TICKET
  </span>
</Link>
</ul> */
}
