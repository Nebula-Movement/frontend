import React from 'react';
import Sidebar from '@/components/Sidebar';
import ProfileNavbar from '@/components/ProfileNavbar';
// import HomeHeader from '@/components/HomeHeader';
import Explore from '@/components/Explore';
import Head from 'next/head';

const Home = () => {
  return (
    <>
      <div className="bg-black h-full">
        <Head>
          <title>Home | Nebula</title>
          <meta name="description" content="Home page" />
        </Head>
        <div className="flex ">
          <Sidebar />
          <ProfileNavbar />
        </div>

        <div className="">
          <div>
            <Explore />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
