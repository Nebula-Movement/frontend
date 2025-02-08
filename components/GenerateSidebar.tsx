// @ts-nocheck
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SiBlockchaindotcom } from 'react-icons/si';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import { FaDiceD20 } from 'react-icons/fa6';
import SwitchButton from './Switch';
import RangeSlider from './RangeSlider';
import Preset from './ai-params/ClipGuidancePreset';
// import StylePreset from './ai-params/StylePreset';
import { BsPatchQuestion } from 'react-icons/bs';
import StylePresetSide from './ai-params/StylePresetSide';

const GenerateSidebar = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const [isPublicImagesEnabled, setIsPublicImagesEnabled] = useState(false);

  return (
    <>
      <nav
        className="hidden custom-scrollbar fixed top-0 left-0 bg-black shadow-2xl items-center h-screen w-[250px] right-0 navbar mt-0 md:block border-r-[1px] border-gray-600"
        style={{ maxWidth: '100vw', overflowX: 'auto' }}
        aria-label="Sidebar"
      >
        <Link className="flex items-center justify-between" href="/home">
          <div className="flex items-center ml-3 mt-6">
            <FaDiceD20 className="text-white text-[24px] " />
            &nbsp;&nbsp;
            <h2 className="font-extrabold text-[24px] leading-[30px] text-white">
              Nebula{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-800">
                AI
              </span>
            </h2>
          </div>

          <div className="mt-6 mr-3 cursor-pointer" onClick={handleBack}>
            <FaArrowAltCircleLeft className="text-white text-2xl " />
          </div>
        </Link>

        <ul className="list-none mt-7 ml-2 flex flex-col sm:flex justify-start items-start gap-4 flex-1 text-gray-300 pt-[4px]">
          {/* <p className="text-md text-gray-400 font-bold text-center ml-4">
            Start Here
          </p> */}

          <div className=" px-4 w-[96%]">
            <h1 className="text-sm mt-4 font-bold flex items-center gap-2">
              Number Of Images{' '}
              <BsPatchQuestion className="text-lg text-purple-500" />{' '}
            </h1>
            <div className="grid grid-cols-4 gap-4 mt-6 text-center text-sm cursor-pointer">
              <div className="p-2 bg-[#0b0f178e] border-gray-600 rounded-md border-[1px] px-3">
                1
              </div>
              <div className="p-2 bg-[#0b0f178e] border-gray-600 rounded-md border-[1px] px-3">
                2
              </div>
              <div className="p-2 bg-[#0b0f178e] border-gray-600 rounded-md border-[1px] px-3">
                3
              </div>
              <div className="p-2 bg-[#0b0f178e] border-gray-200 rounded-md border-[1px] px-3">
                4
              </div>
              <div className="p-2 bg-[#0b0f178e] border-gray-600 rounded-md border-[1px] px-3">
                5
              </div>
              <div className="p-2 bg-[#0b0f178e] border-gray-600 rounded-md border-[1px] px-3">
                6
              </div>
              <div className="p-2 bg-[#0b0f178e] border-gray-600 rounded-md border-[1px] px-3">
                7
              </div>
              <div className="p-2 bg-[#0b0f178e] border-gray-600 rounded-md border-[1px] px-3">
                8
              </div>
            </div>
          </div>

          <div className="border-t-[1px] border-gray-700 flex items-center justify-start px-4 w-[96%] gap-6">
            <h1 className="text-sm  font-bold">Public Images </h1>

            <div>
              <SwitchButton
                enabled={isPublicImagesEnabled}
                setEnabled={setIsPublicImagesEnabled}
              />
            </div>
          </div>

          <div className="border-t-[1px] border-gray-700 justify-start px-4 w-[96%]">
            <h1 className="text-sm mt-4 font-bold flex items-center gap-2">
              Input Dimensions{' '}
              <BsPatchQuestion className="text-lg text-purple-500" />{' '}
            </h1>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <div className="grid grid-cols-2 gap-2  text-center text-[12px] mb-4">
              <div className="p-2 bg-[#0b0f178e] border-gray-600 rounded-md border-[1px] px-4">
                512 x 512
              </div>
              <div className="p-2 bg-[#0b0f178e] border-gray-600 rounded-md border-[1px] px-4">
                768 x 512
              </div>
              <div className="p-2 bg-[#0b0f178e] border-gray-200 rounded-md border-[1px] px-3">
                1024 x 1024
              </div>
              <div className="p-2 bg-[#0b0f178e] border-gray-600 rounded-md border-[1px] px-3">
                768 x 1024
              </div>
              <div className="p-2 bg-[#0b0f178e] border-gray-600 rounded-md border-[1px] px-3">
                1360 x 768
              </div>
              <div className="p-2 bg-[#0b0f178e] border-gray-600 rounded-md border-[1px] px-3">
                768 x 1360
              </div>
            </div>
          </div>
        </ul>

        <div className="border-t-[1px] border-gray-700 justify-start px-4 w-[96%]">
          <h1 className="text-sm mt-4 font-bold flex items-center gap-2 text-gray-300">
            Steps <BsPatchQuestion className="text-lg text-purple-500" />{' '}
          </h1>
          <RangeSlider count="block" cfg="hidden" />
        </div>

        <div className="border-t-[1px] border-gray-700 justify-start px-4 mb-3 w-[96%]">
          <h1 className="text-sm mt-4 mb-2 font-bold flex items-center gap-2 text-gray-300">
            Clip_Guidance_Preset{' '}
            <BsPatchQuestion className="text-lg text-purple-500" />{' '}
          </h1>
          <Preset />
        </div>

        <div className="border-t-[1px] border-gray-700 justify-start px-4 mb-3 w-[96%]">
          <h1 className="text-sm mt-4 mb-2 font-bold flex items-center gap-2 text-gray-300">
            Style_Preset <BsPatchQuestion className="text-lg text-purple-500" />{' '}
          </h1>
          <StylePresetSide />
        </div>

        <div className="border-t-[1px] border-gray-700 justify-start px-4 w-[96%]">
          <h1 className="text-sm mt-4 font-bold flex items-center gap-2 text-gray-300">
            Cfg_Scale <BsPatchQuestion className="text-lg text-purple-500" />{' '}
          </h1>
          <RangeSlider count="hidden" cfg="block" />
        </div>
      </nav>
    </>
  );
};

export default GenerateSidebar;
