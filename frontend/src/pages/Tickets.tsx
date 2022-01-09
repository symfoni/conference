import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GiveTicket } from "../components/GiveTicket";
import { Register } from "../components/Register";
import { ConferenceContext } from "../hardhat/SymfoniContext";

interface Props {}
export const Tickets: React.FC<Props> = () => {
  const conference = useContext(ConferenceContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [price, setPrice] = useState("");
  const [isRegistered, setHasTicket] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  useEffect(() => {
    const doAsync = async () => {
      setLoading(true);
      if (!conference.instance) return;
      const _isAuthed = await conference.instance.isAuthenticated();
      const _isOwner = await conference.instance.isOwner();
      const _hasTicket = await conference.instance.hasTicket();
      const _isSpeaker = await conference.instance.isSpeaker();
      console.log(
        "sold for",
        ethers.utils.formatEther(await conference.instance._amountSoldFor())
      );
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

  if (loading) {
    return <h1>Laster....</h1>;
  }

  if (isOwner) {
    return (
      <h2>
        Du kan ikke kjøpe billett når du er konferanseeier. For å gi bort
        billett til en adresse. Gå til <Link to="/admin">adminpanelet</Link>
      </h2>
    );
  }

  if (!isAuthed) {
    return (
      <div>
        <h2>
          Du må være autentisert for å kjøpe billett. Ta kontakt med admin
        </h2>
        <p>
          (siden dette er test så må du autentisere addressen fra konferanseeier
          ethereum kontoen)
        </p>
      </div>
    );
  }

  return <Register />;
};
