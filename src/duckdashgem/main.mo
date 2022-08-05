import Map "mo:base/HashMap";
import Text "mo:base/Text";

actor Gem {
  let gemWalletMap = Map.HashMap<Text, Nat>(0, Text.equal, Text.hash);

  public func initGemWallet(userID : Text) : async () {
    switch (gemWalletMap.get(userID)) {
      case null {
        gemWalletMap.put(userID, 0);
      };
      case (?id) { };
    }
  };

  public func getGemWallet(userID : Text) : async Nat {
    switch (gemWalletMap.get(userID)) {
      case null {
        return 0;
      };
      case (?gem) {
        return gem;
       };
    }
  };

  public func addGem(userID : Text, amount: Nat) : async Nat {
    switch (gemWalletMap.get(userID)) {
      case (?current_game) {
        var new_gem = current_game + amount;
        gemWalletMap.put(userID, new_gem);

        return new_gem;
      };
      case null {
        return 0;
      };
    }
  };
};