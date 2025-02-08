'use client';

import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import CreateChallengeModal from './modals/CreateChallengeModal';
import WalletSelector from '@/helpers/WalletSelector';

const ProfileNavbar = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  return (
    <nav
      className={`ml-[210px] h-1/2  opacity-80 shadow-2xl w-[100%] py-1 border-b-[1px] border-gray-800 bg-[url('/bg-stars.png')] bg-repeat-y bg-center relative mt-2 pb-3`}
    >
      {/* <div className="absolute w-[50%] inset-0 gradient-01" /> */}
      <div
        className={`mx-auto flex flex-row justify-between mt-4 items-center gap-3`}
      >
        <div className="my-4">
          <SearchBar />
        </div>
        <ul className="absolute right-[120px]">
          {/* w-full*/}
          <li className="flex gap-4 mr-[120px] text-gray-300 ">
            <a href="/">Docs</a>
            <a onClick={handleOpenModal} className="cursor-pointer">
              Create
            </a>
          </li>
        </ul>
        <div>
          {/* <MdOutlineNotificationsNone className="text-2xl text-white " /> */}
        </div>
        &nbsp;
        <WalletSelector />
      </div>
      <CreateChallengeModal
        openMintModal={openModal}
        handleOnClose={() => setOpenModal(false)}
      />
    </nav>
  );
};

export default ProfileNavbar;
