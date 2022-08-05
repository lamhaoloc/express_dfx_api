import type { Principal } from '@dfinity/principal';
export interface _SERVICE {
  'addGem' : (arg_0: string, arg_1: bigint) => Promise<bigint>,
  'getGemWallet' : (arg_0: string) => Promise<bigint>,
  'initGemWallet' : (arg_0: string) => Promise<undefined>,
}
