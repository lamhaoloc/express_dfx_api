export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'addGem' : IDL.Func([IDL.Text, IDL.Nat], [IDL.Nat], []),
    'getGemWallet' : IDL.Func([IDL.Text], [IDL.Nat], []),
    'initGemWallet' : IDL.Func([IDL.Text], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
