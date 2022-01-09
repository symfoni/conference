import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { ConferenceContext } from "../hardhat/SymfoniContext";

interface Props {}

export const Register: React.FC<Props> = () => {
  const conference = useContext(ConferenceContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [price, setPrice] = useState("");
  const [isRegistered, setHasTicket] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const doAsync = async () => {
      setLoading(true);
      if (!conference.instance) return;
      const _isAuthed = await conference.instance.isAuthenticated();
      const _isOwner = await conference.instance.isOwner();
      const _hasTicket = await conference.instance.hasTicket();
      const _isSpeaker = await conference.instance.isSpeaker();
      const _price = await conference.instance.price();
      const _isOpen = await conference.instance._openForRegistration();
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
      setIsOpen(_isOpen);
    };
    doAsync();
  }, [conference]);

  const handleConfirmBuyTicket = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!conference.instance) throw Error("Conference instance not ready");
    if (conference.instance) {
      setLoading(true);
      const tx = await conference.instance.buyTicket({
        value: ethers.utils.parseEther("1.0"),
      });
      console.log("buyTicket tx", tx);
      await tx.wait();
      const _hasTicket = await conference.instance.hasTicket();
      setHasTicket(_hasTicket);

      setLoading(false);
    }
  };

  if (loading) {
    return <div>Laster</div>;
  }

  if (!isOpen) {
    return (
      <div>
        <p>Billettkjøp er stengt</p>
      </div>
    );
  }

  return (
    <div>
      <p>Pris for konferansen er {price} ether</p>
      {isRegistered && <p>Du har allerede billett til konferanse</p>}
      {!isRegistered && !isAuthed && (
        <p>
          Du mangler å bli autentisert av eier av konferansen eller av en
          trusted tredjepart
        </p>
      )}
      {!isRegistered && isAuthed && (
        <button onClick={(e) => handleConfirmBuyTicket(e)}>
          Register for conference!
        </button>
      )}
    </div>
  );
};
