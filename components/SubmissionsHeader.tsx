import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useImages } from '@/context/ImageContext';
import useIpfsData from '@/utils/useIpfsData';
import SearchSubmission from './SearchSubmission';
import MakeSubmissionModal from './modals/MakeSubmissionModal';

const SubmissionsHeader = () => {
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  const { ipfsUri } = router.query;
  const { setChallengeDescription, challengeDescription } = useImages();
  const [isLoading, setIsLoading] = useState(true);

  const ipfsData = useIpfsData(Array.isArray(ipfsUri) ? ipfsUri[0] : ipfsUri);

  useEffect(() => {
    if (router.isReady) {
      setIsLoading(false);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (ipfsData?.description) {
      setChallengeDescription(ipfsData.description);
    }
  }, [ipfsData, setChallengeDescription]);

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <>
      <div className="submission-header-bg text-white text-start mb-6 py-10 h-[240px] ml-[250px]">
        <h1 className="text-3xl py-1 pt-2 font-bold bg-transparent ml-10">
          Make a submission to {ipfsData?.name || 'Challenge'}
        </h1>
        <p className="pb-6 pt-4 italic bg-transparent text-start text-xl w-[60%] ml-10">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 font-bold pr-1">
            Challenge Description:
          </span>
          {challengeDescription ||
            ipfsData?.description ||
            'No description available'}
        </p>
      </div>

      <div className="ml-[210px] mb-6 flex items-center text-white mr-[40px]">
        <SearchSubmission />
        <button
          className="text-white bg-gradient-to-r from-purple-700 via-purple-500 to-pink-500 mt-3 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 rounded-lg text-sm font-bold w-[100px] sm:w-[200px] px-4 py-2 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
          onClick={() => setOpenModal(true)}
        >
          Submit to Challenge
        </button>
      </div>

      <MakeSubmissionModal
        openModal={openModal}
        handleOnClose={() => setOpenModal(false)}
      />
    </>
  );
};

export default SubmissionsHeader;
