import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { ConferenceContext } from "../hardhat/SymfoniContext";

interface Props {}

export const ClaimReward: React.FC<Props> = () => {
  const conference = useContext(ConferenceContext);
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [claimableAmount, setClaimableAmount] = useState("");
  const [amountSoldFor, setAmountSoldFor] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const doAsync = async () => {
      setLoading(true);
      if (!conference.instance) return;
      const _isOwner = await conference.instance.isOwner();
      const _isOpen = await conference.instance._openForRegistration();
      const _claimAbleAmount = await conference.instance.checkEligbleRewardAmount();
      const _amountSoldFor = await conference.instance._amountSoldFor();
      setClaimableAmount(ethers.utils.formatEther(_claimAbleAmount));
      setAmountSoldFor(ethers.utils.formatEther(_amountSoldFor));
      setIsOpen(_isOpen);
      setIsOwner(_isOwner);
      setLoading(false);
    };
    doAsync();
  }, [conference, refresh]);

  const handleClaimReward = async () => {
    if (!conference.instance) throw Error("Conference instance not ready");
    if (conference.instance) {
      if (isOwner) {
        const tx = await conference.instance.claimOwnerReward();
        console.log("claimOwnerReward tx", tx);
        await tx.wait();
      } else {
        const tx = await conference.instance.claimSpeakerReward();
        console.log("claimSpeakerReward tx", tx);
        await tx.wait();
        setRefresh(refresh + 1);
      }
    }
  };

  if (loading) {
    return <div>Laster</div>;
  }

  return (
    <div>
      <h2>Gjør krav på din del av inntektene</h2>
      <p>Konferansen har solgt billetter for {amountSoldFor} ETH</p>
      <p>Din andel er {claimableAmount} ETH</p>
      <p>
        Konferansen må være stengt for registeringen av konferanseeier før du
        kan gjøre krav på din andel
      </p>
      <br />
      {isOpen ? (
        <button disabled={true}>Gjør krav ikke mulig. Må stenges</button>
      ) : (
        <button
          disabled={claimableAmount == "0.0"}
          onClick={(e) => handleClaimReward()}
        >
          Gjør krav på {claimableAmount}
        </button>
      )}
    </div>
  );
};
