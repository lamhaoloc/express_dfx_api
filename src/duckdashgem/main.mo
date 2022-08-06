import Error "mo:base/Error";
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

  public func transferGem(from : Text, to: Text, amount: Nat) : async Nat {
    switch (gemWalletMap.get(to)) {
      case (?target_user_gem) {
        switch (gemWalletMap.get(from)) {
          case (?current_gem) {
            if(current_gem < amount) {
              throw Error.reject("Not enough gem to transfer!");
            };

            var from_user_gem = current_gem - amount;
            var to_user_gem = target_user_gem + amount;

            gemWalletMap.put(from, from_user_gem);
            gemWalletMap.put(to, to_user_gem);

            return from_user_gem;
          };
          case null {
            throw Error.reject("Not found user with id: " # from);
          }
        }
      };
      case null {
        throw Error.reject("Not found user with id: " # to);
      }
    }
  }
};