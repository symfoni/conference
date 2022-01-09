import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { ConferenceContext } from "../hardhat/SymfoniContext";

interface Props {}

export const GiveTicket: React.FC<Props> = () => {
  const conference = useContext(ConferenceContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [price, setPrice] = useState("");
  const [isRegistered, setHasTicket] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [addressToGiveTicket, setAddressToGiveTicket] = useState("");

  useEffect(() => {
    const doAsync = async () => {
      setLoading(true);
      if (!conference.instance) return;
      const _isAuthed = await conference.instance.isAuthenticated();
      const _isOwner = await conference.instance.isOwner();
      const _hasTicket = await conference.instance.hasTicket();
      const _isSpeaker = await conference.instance.isSpeaker();
      const _price = await conference.instance.price();
      console.log("isAuthed", _isAuthed);
      console.log("isOwner", _isOwner);
      console.log("hasTicket", _hasTicket);
      console.log("isSpeaker", _isSpeaker);
      console.log("price", _price);
      setIsOwner(_isOwner);
      setIsAuthed(_isAuthed);
      setPrice(ethers.utils.formatEther(_price));
      setHasTicket(_hasTicket);
      setIsSpeaker(_isSpeaker);
      setLoading(false);
    };
    doAsync();
  }, [conference]);

  const handleGiveTicketToAddress = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!conference.instance) throw Error("Conference instance not ready");
    if (conference.instance) {
      if (!ethers.utils.isAddress(addressToGiveTicket)) {
        setMessage(`Wrong address format of input ${addressToGiveTicket}`);
        return;
      }
      const tx = await conference.instance.giveTicket(addressToGiveTicket);
      console.log("giveTicket tx", tx);
      await tx.wait();

      setAddressToGiveTicket("");
    }
  };

  if (loading) {
    return <div>Laster</div>;
  }

  if (isOwner) {
    return (
      <div>
        <div>
          <h1>Legg inn ethereum addressen til personen du vil gi billett</h1>
        </div>
        {message != "" && (
          <p>Du prøver å gi billett noe som ikke er en ethereum addresse</p>
        )}
        <input
          value={addressToGiveTicket}
          onChange={(e) => {
            setMessage("");
            setAddressToGiveTicket(e.target.value);
          }}
        ></input>
        <button onClick={(e) => handleGiveTicketToAddress(e)}>
          Gi billett til addresse
        </button>
      </div>
    );
  }

  return (
    <div>
      <p>
        Du har ikke riktig tilgang for å gi bort billett. Du må være
        konferanseeier
      </p>
    </div>
  );
};
