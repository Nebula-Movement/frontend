import React from 'react';

const Technologies = () => {
  return (
    <div className="text-center flex justify-center pt-8 text-lg">
      <ul className="flex gap-3 text-gray-400">
        <li>Powered By:</li>
        <li className="flex items-center">
          <img
            src="https://pbs.twimg.com/profile_images/1744477796301496320/z7AIB7_W_400x400.jpg"
            alt=""
            className="w-[27px] h-[27px] rounded-full"
          />
          &nbsp;
          <p className="text-md">Movement</p>
        </li>
        {/* <li className="flex items-center">
          <img src="zora.png" alt="" className="w-[27px]" />
          &nbsp;
          <p>Zora</p>
        </li>
        <li className="flex items-center">
          <img src="covalent.jpg" alt="" className="w-[27px]" />
          &nbsp;
          <p>Covalent</p>
        </li> */}
      </ul>
    </div>
  );
};

export default Technologies;
