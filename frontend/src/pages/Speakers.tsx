import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { ClaimReward } from "../components/ClaimReward";
import { ConferenceContext } from "../hardhat/SymfoniContext";

interface Props {}

export const Speakers: React.FC<Props> = () => {
  const conference = useContext(ConferenceContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [amountSoldFor, setAmountSoldFor] = useState("");
  const [rewardFactor, setRewardFactor] = useState(0);
  const [
    currentEstimatedSpeakerReward,
    setCurrentEstimatedSpeakerReward,
  ] = useState(0);
  const [numberOfSpeakers, setNumbersOfSpeakers] = useState(0);

  useEffect(() => {
    const doAsync = async () => {
      setLoading(true);
      if (!conference.instance) return;
      const _isAuthed = await conference.instance.isAuthenticated();
      const _isOwner = await conference.instance.isOwner();
      const _isSpeaker = await conference.instance.isSpeaker();
      const _isOpen = await conference.instance._openForRegistration();
      const _amountSoldFor = await conference.instance._amountSoldFor();
      const _speakerRewardFactor = await conference.instance._speakerRewardFactor();
      const _numberOfSpeakers = await conference.instance._numberOfSpeakers();
      console.log("isAuthed", _isAuthed);
      console.log("isOwner", _isOwner);
      console.log("isSpeaker", _isSpeaker);
      setIsOwner(_isOwner);
      setIsAuthed(_isAuthed);
      setIsSpeaker(_isSpeaker);
      const amountSold = ethers.utils.formatEther(_amountSoldFor);
      const factor = _speakerRewardFactor.toNumber();
      const numSpeakers = _numberOfSpeakers.toNumber();
      console.log("amountSold", amountSold);
      console.log("numSpeakers", numSpeakers);
      setAmountSoldFor(amountSold);
      setRewardFactor(factor);
      setNumbersOfSpeakers(numSpeakers);
      const estimate = parseInt(amountSold) / factor / (1 + numSpeakers);
      console.log("estimate", estimate);
      setCurrentEstimatedSpeakerReward(estimate);
      setLoading(false);
      setIsOpen(_isOpen);
    };
    doAsync();
  }, [conference]);

  const handleConfirmRegisterAsSpeaker = async () => {
    if (!conference.instance) throw Error("Conference instance not ready");
    if (conference.instance) {
      setLoading(true);
      const tx = await conference.instance.registerAsSpeaker();
      console.log("registerAsSpeaker tx", tx);
      await tx.wait();
      const _isSpeaker = await conference.instance.isSpeaker();
      setIsSpeaker(_isSpeaker);

      setLoading(false);
    }
  };

  if (loading) {
    return <div>Laster</div>;
  }

  return (
    <div>
      <h1>For fordragsholdere</h1>
      <h2>Honerar</h2>
      <p>
        Estimert honorar for å holde fordrag er: {currentEstimatedSpeakerReward}
      </p>
      <p>
        Det er basert på salgsinntekter på {amountSoldFor} ETH, fordelt på{" "}
        {numberOfSpeakers + 1} foredragsholdere, og rewardfaktor på{" "}
        {rewardFactor}, som betyr at {(1 / rewardFactor) * 100}% av
        salgsinntektene går til foredragsholdere
      </p>
      {isSpeaker && (
        <>
          <p>Du er påmeldt som foredragsholder</p>
        </>
      )}

      {!isSpeaker && !isAuthed && (
        <>
          <h2>Autentisering for påmelding</h2>
          <p>
            Du mangler å bli autentisert av eier av konferansen eller av en
            trusted tredjepart. Det kreves for å være foredragsholder
          </p>
        </>
      )}
      {isOpen && !isSpeaker && isAuthed && (
        <>
          <h2>Registering</h2>
          <button onClick={() => handleConfirmRegisterAsSpeaker()}>
            Register as speaker!
          </button>
        </>
      )}
      <ClaimReward />
    </div>
  );
};
