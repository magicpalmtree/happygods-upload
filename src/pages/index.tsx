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

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cid: string = (await fileUpload(nft.image)) as string;

    const file = await fetchFile(cid);
    setNft({
      ...nft,
      image: file,
    });

    const result = await save({
      name: nft.name,
      description: nft.description,
      image: cid,
    });
    console.log(result);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (e.currentTarget.name === 'image') {
      setNft((nft) => ({
        ...nft,
        [e.target.name]: e.target.files[0],
      }));
    } else {
      setNft((nft) => ({
        ...nft,
        [e.target.name]: e.target.value,
      }));
    }
  };

  return (
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
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p>
            </div>
          )}

          {!!nft.image && (
            <img
              className="h-60 max-w-full rounded-lg"
              src={getImage(nft.image)}
              alt="image"
            />
          )}

          <input
            name="image"
            type="file"
            className="hidden"
            onChange={handleChange}
            required
          />
        </label>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Upload
        </button>
      </div>
    </form>
  );
};

export default Home;
