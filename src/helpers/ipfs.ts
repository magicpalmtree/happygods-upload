import { create, IPFSHTTPClient, CID } from 'ipfs-http-client';
import { IPFS_ID, IPFS_KEY } from 'helpers/constants';

let ipfs: IPFSHTTPClient | undefined;

try {
  const hash = btoa(IPFS_ID + ':' + IPFS_KEY);

  ipfs = create({
    url: 'https://ipfs.infura.io:5001/api/v0',
    headers: {
      authorization: 'Basic ' + hash,
    },
  });
} catch (error) {
  console.error('IPFS error ', error);
  ipfs = undefined;
}

export const fileUpload = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    if (ipfs) {
      try {
        const result = await ipfs.add(data);
        resolve(result.path);
      } catch (e) {
        console.log(e);
        reject();
      }
    }
  });
};

export const fetchFile = async (cid: string | CID) => {
  return new Promise(async (resolve, reject) => {
    if (ipfs) {
      let content: any[] = [];
      for await (const chunk of ipfs.cat(cid)) {
        content = [...content, ...chunk];
      }
      const data = Buffer.from(content).toString('base64');
      resolve(data);
    }
  });
};
