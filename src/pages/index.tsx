import { useState } from 'react';
import type { NextPage } from 'next';
import { useNewMoralisObject } from 'react-moralis';
import { fileUpload, fetchFile } from 'helpers/ipfs';
import { getImage } from 'helpers/utils';

const Home: NextPage = () => {
  const { isSaving, error, save } = useNewMoralisObject('Frens');

  const [nft, setNft] = useState<{
    name: string;
    description: string;
    image: any;
  }>({
    name: '',
    description: '',
    image: null,
  });
  const [uploaded, setUploaded] = useState(false);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setUploaded(false);
    await Promise.all(
      Object.values(nft.image).map(async (el: any) => {
        const cid: string = (await fileUpload(el)) as string;
        const file = await fetchFile(cid);

        const result = await save({
          name: nft.name,
          description: nft.description,
          image: cid,
        });
      }),
    );
    setUploaded(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (e.target.name === 'image') {
      setNft((nft) => ({
        ...nft,
        [e.target.name]: (e.target as any).files,
      }));
    } else {
      setNft((nft) => ({
        ...nft,
        [e.target.name]: e.target.value,
      }));
    }
  };

  return (
    <div>
      <form
        className="flex flex-col justify-center items-center h-screen"
        onSubmit={handleUpload}
      >
        <div className="flex flex-col justify-center items-center w-1/2">
          <div className="mb-2 w-full">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
              Name
            </label>
            <input
              type="text"
              name="name"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Happy"
              value={nft.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2 w-full">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Your message..."
              value={nft.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <label className="flex flex-col justify-center items-center w-full h-64 mb-2 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            {!nft.image && (
              <div className="flex flex-col justify-center items-center pt-5 pb-6">
                <svg
                  aria-hidden="true"
                  className="mb-3 w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 3000x3000px)
                </p>
              </div>
            )}

            {!!nft.image && (
              <div className="flex flex-row max-w-full gap-4 overflow-y-hidden overflow-x-auto p-4">
                {Object.values(nft.image).map((img: any, index) => (
                  <img
                    key={index}
                    className="h-full max-w-full rounded-lg"
                    src={getImage(img)}
                    alt="image"
                  />
                ))}
              </div>
            )}

            <input
              name="image"
              type="file"
              className="hidden"
              onChange={handleChange}
              multiple
              required
            />
          </label>

          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Upload
          </button>
        </div>
      </form>
      <div
        role="alert"
        className={
          uploaded
            ? 'sm:mr-6 mt-16 sm:mt-6 mb-6 sm:mb-0 xl:w-3/12 mx-auto absolute left-0 sm:left-auto right-0 sm:top-0 sm:w-6/12 md:w-3/5 justify-between w-11/12 bg-white  dark:bg-gray-800 shadow-lg rounded flex sm:flex-row flex-col transition duration-150 ease-in-out translate-show'
            : 'translate-hide'
        }
      >
        <div className="sm:px-6 p-2 flex mt-4 sm:mt-0 ml-4 sm:ml-0 items-center justify-center bg-green-400 sm:rounded-tl sm:rounded-bl w-12 h-12 sm:h-auto sm:w-auto text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={20}
            height={20}
            fill="currentColor"
          >
            <path
              className="heroicon-ui"
              d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-2.3-8.7l1.3 1.29 3.3-3.3a1 1 0 0 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-2-2a1 1 0 0 1 1.4-1.42z"
            />
          </svg>
        </div>
        <div className="flex flex-col justify-center xl:-ml-4 pl-4 xl:pl-1 sm:w-3/5 pt-4 sm:pb-4 pb-2">
          <p className="text-base text-gray-800 dark:text-gray-100 font-semibold pb-1">
            All images are successfully uploaded
          </p>
        </div>
      </div>
      <style>
        {`
        .translate-show{
            transform : translateX(0%);
        }
        .translate-hide{
            transform : translateX(150%);
        }
        `}
      </style>
    </div>
  );
};

export default Home;
