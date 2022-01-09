import React, { useContext, useEffect, useState } from "react";
import { ConferenceContext } from "../hardhat/SymfoniContext";

interface Props {}

export const CloseRegistration: React.FC<Props> = () => {
  const conference = useContext(ConferenceContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const doAsync = async () => {
      setLoading(true);
      if (!conference.instance) return;
      const _isOwner = await conference.instance.isOwner();
      const _isOpen = await conference.instance._openForRegistration();
      setIsOpen(_isOpen);
      setIsOwner(_isOwner);
      setLoading(false);
    };
    doAsync();
  }, [conference]);

  const handleCloseConference = async () => {
    if (!conference.instance) throw Error("Conference instance not ready");
    if (conference.instance) {
      const tx = await conference.instance.closeRegistration();
      console.log("closeRegistration tx", tx);
      await tx.wait();
      window.location.reload();
    }
  };

  if (loading) {
    return <div>Laster</div>;
  }

  if (isOwner) {
    return (
      <div>
        <h2>Steng for registrering</h2>
        <p>
          Her kan du stenge konferansen for registrering. Når den er stengt, kan
          du og foredragsholdere claime deres del av inntektene.
        </p>
        <br />
        {isOpen ? (
          <button onClick={(e) => handleCloseConference()}>
            Steng registrering
          </button>
        ) : (
          <>
            <p>Konferanse steng for registering</p>
            <button disabled={true}>
              Steng registrering er allerede gjort
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      <p>Du har ikke riktig tilgang for å stenge for registrering</p>
    </div>
  );
};
