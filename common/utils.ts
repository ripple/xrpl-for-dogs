import {
  AccountNFTsResponse,
  Client,
  Transaction,
  TxResponse,
  Wallet,
  convertStringToHex,
  rippleTimeToISOTime,
} from 'xrpl';
import axios from 'axios';
import Config from 'react-native-config';

import { IPFS_URI_SCHEME, MINT_BY_MEMO } from './constants';
import { TokenMetadata, TransactionFields } from './entities';

export async function getJSON(url: string): Promise<void> {
  const response = await fetch(url);
  if (response.ok) return response.json();
  throw new Error(response.statusText);
}

export async function getMetadata(cid: string): Promise<void> {
  try {
    const metadata = await getJSON(
      `${Config.PINATA_PRIVATE_GATEWAY || Config.PUBLIC_GATEWAY}/${cid}`,
    );
    return metadata;
  } catch (error) {
    console.error(error);
  }
}

export function getGatewayUrl(ipfsUrl: string): string {
  const cid = ipfsUrl.replace(IPFS_URI_SCHEME, '');

  return `${Config.PINATA_PRIVATE_GATEWAY || Config.PUBLIC_GATEWAY}/${cid}`;
}

export function formatCIDtoIPFS(cid: string) {
  return `${IPFS_URI_SCHEME}${cid}`;
}

export function formatDate(date: number): string {
  const iso = rippleTimeToISOTime(date);
  return new Date(iso).toString();
}

export async function buildTransaction(
  txFields: TransactionFields,
  client: Client,
  wallet: Wallet,
  metadataUri: string,
) {
  const transaction: Transaction = await client.autofill({
    TransactionType: 'NFTokenMint',
    Account: wallet.address,
    URI: convertStringToHex(metadataUri),
    Flags: Number(txFields.flags),
    TransferFee: Number(txFields.transferFee),
    NFTokenTaxon: Number(txFields.taxon),
    Memos: [
      {
        Memo: {
          MemoData: convertStringToHex(MINT_BY_MEMO),
        },
      },
    ],
  });

  return transaction;
}

export async function mintNft(
  txFields: TransactionFields,
  client: Client,
  wallet: Wallet,
  metadataUri: string,
): Promise<TxResponse> {
  const transaction: Transaction = await buildTransaction(
    txFields,
    client,
    wallet,
    metadataUri,
  );

  const signedTx = wallet.sign(transaction);

  const txResponse = await client.submitAndWait(signedTx.tx_blob, { wallet });

  return txResponse;
}

export async function getNfts(
  client: Client,
  wallet: Wallet,
): Promise<AccountNFTsResponse> {
  const nfts = await client.request({
    command: 'account_nfts',
    account: wallet.address,
  });
  return nfts;
}

export async function pinImageToIPFS(file: string) {
  const data = new FormData();
  data.append('file', {
    name: String(Date.now()),
    uri: file,
  });

  try {
    const res = await axios({
      method: 'post',
      url: `${Config.PINATA_BASE_URL}/pinFileToIPFS`,
      headers: {
        Authorization: `Bearer ${Config.PINATA_TOKEN}`,
        Accept: 'application/json',
      },
      maxBodyLength: Infinity,
      data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function pinJSONToIPFS(metadata: TokenMetadata) {
  try {
    const res = await axios({
      method: 'post',
      url: `${Config.PINATA_BASE_URL}/pinJSONToIPFS`,
      headers: {
        Authorization: `Bearer ${Config.PINATA_TOKEN}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(metadata, null, 2),
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
}
