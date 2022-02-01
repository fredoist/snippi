import type { NextApiRequest, NextApiResponse } from 'next';
import { Buffer } from 'buffer';
import { nftCollection } from '@utils/thirdweb';
import nodeHtmlToImage from 'node-html-to-image';
import { generateSnippet } from '@utils/generateSnippet';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { address, name, description, code } = req.body;
  if (!address) {
    res.status(400).end('Missing Address');
    return;
  }

  const snippet = generateSnippet(name, code);

  const file = new Buffer(snippet, 'utf-8');
  const image = await nodeHtmlToImage({
    html: snippet,
  });

  return new Promise<void>((resolve) => {
    nftCollection
      .mintTo(address, {
        name,
        description,
        image,
        file,
      })
      .then((data) => {
        res.status(200).json(data);
        console.log('New NFT data ->', data);
        resolve();
      });
  });
};

export default handler;