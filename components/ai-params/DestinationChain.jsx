import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
// import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

const destination_chain = [
  {
    name: 'Aptos Testnet',
    img: 'https://s2.coinmarketcap.com/static/img/coins/200x200/21794.png',
  },
];

export default function DestinationChain() {
  const [selected, setSelected] = useState(destination_chain[0]);

  return (
    <div className="w-[60%] bg-transparent z-[999]">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-[200px]  text-black border-gray-600 border-[1px] bg-transparent rounded-lg  py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm cursor-pointer">
            <span className="block truncate bg-transparent text-white font-bold">
              <span className="text-gray-400 py-4 font-medium text-center ml-8">
                Destination Chain
              </span>
              <br />
              <span className="flex items-center gap-2 mt-2">
                <img src={selected.img} alt="" className="h-6 w-6 ml-6" />

                {selected.name}
              </span>
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              {/* <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              /> */}
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-[200px] ml-5 overflow-auto rounded-md border-[1px] border-gray-500 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {destination_chain.map((chain, chainIdx) => (
                <Listbox.Option
                  key={chainIdx}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 bg-black ${
                      active ? 'bg-[#0b0f178e] text-gray-400' : 'text-white'
                    }`
                  }
                  value={chain}
                >
                  {({ selected }) => (
                    <>
                      <img
                        src={chain.img}
                        alt={chain.name}
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6"
                      />
                      <span
                        className={`block truncate bg-transparent pl-12 ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {chain.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-600">
                          {/* <CheckIcon className="h-5 w-5" aria-hidden="true" /> */}
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
