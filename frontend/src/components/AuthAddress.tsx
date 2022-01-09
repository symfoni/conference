import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { ConferenceContext } from "../hardhat/SymfoniContext";

interface Props {}

export const AuthAddress: React.FC<Props> = () => {
  const conference = useContext(ConferenceContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [addressToAuth, setAddressToAuth] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [isAuthProvider, setIsAuthProvider] = useState(false);

  useEffect(() => {
    const doAsync = async () => {
      setLoading(true);
      if (!conference.instance) return;
      console.log("Conference is deployed at ", conference.instance.address);
      const _isAuthProv = await conference.instance.isAuthProvider();
      const _isOwner = await conference.instance.isOwner();
      console.log("isAuthProvider", _isAuthProv);
      console.log("isOwner", _isOwner);
      setIsAuthProvider(_isAuthProv);
      setIsOwner(_isOwner);
      setLoading(false);
    };
    doAsync();
  }, [conference]);

  const handleSetAddressToAuth = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!conference.instance) throw Error("Conference instance not ready");
    if (conference.instance) {
      if (!ethers.utils.isAddress(addressToAuth)) {
        setMessage(`Wrong address format of input ${addressToAuth}`);
        return;
      }
      const tx = await conference.instance.auth(addressToAuth);
      console.log("auth tx", tx);
      await tx.wait();

      setAddressToAuth("");
    }
  };

  if (loading) {
    return <div>Laster</div>;
  }

  if (isAuthProvider || isOwner) {
    return (
      <div>
        <h1>Adminpanel</h1>
        <h2>Autentisering av brukere</h2>
        <p>
          Her kan du autentisere addresser som skal få lov til å kjøpe billetter
        </p>
        <p>
          (Dette ville vært gjort på en annen måte. F.eks. at brukere
          autentiserte seg hos en tredjepart vi valgte å stole på og deretter
          godkjente addressen)
        </p>
        <br />
        {message != "" && (
          <p>Du prøver å autentisere noe som ikke er en ethereum addresse</p>
        )}
        <input
          value={addressToAuth}
          onChange={(e) => {
            setMessage("");
            setAddressToAuth(e.target.value);
          }}
        ></input>
        <button onClick={(e) => handleSetAddressToAuth(e)}>Auth address</button>
      </div>
    );
  }

  return (
    <div>
      <p>Du har ikke riktig tilgang for å autentisere addresser</p>
    </div>
  );
};
