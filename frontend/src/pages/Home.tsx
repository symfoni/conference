import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ConferenceContext } from "../hardhat/SymfoniContext";

interface Props {}
export const Home: React.FC<Props> = () => {
  return (
    <>
      <h1>Velkommen til konferanse.</h1>
      <h2>Her kan du</h2>
      <ul>
        <li>Kjøpe billett til konferanse</li>
        <li>Melde deg opp som foredragsholder</li>
        <li>
          Foredragsholdere kan få en del av inntektene for billettsalget. Den
          faktoren bestemmes av konferanseeieren
        </li>
        <li>Som konferanseeier kan du gi bort billetter</li>
        <li>Brukere må autentiseres før de kan kjøpe billett.</li>
      </ul>
      <br />
      <h2>Som konferanseeier</h2>
      <h3>Autentisere brukere</h3>
      <p>
        For at brukere kan kjøpe billett må deres ethereum addresse være
        autentisert. Dette ville typisk vært gjort i en selvbetjeningsløsning
        med innlogging hos en valgt tredjepart. F.eks. BankID. Ved gyldig token
        fra BankID autentiserer en service ethereum addressen til brukeren.
      </p>
      <p>
        Siden dette er en testside, må du eier av konferensen autentisere
        addressene manuelt. Det gjøres <Link to="/admin">her</Link>
      </p>
      <h3>Gi bort billetter</h3>
      <p>
        Som konferanseeier kan gi bort billetter til personer(ethereum
        addresser) ved å gå <Link to="/tickets">hit</Link>
      </p>
      <h3>Betale foredragsholdere</h3>
      <p>
        Sette hvor stor andel av billettintektene som skal betales til
        foredragsholderene (likt fordelt mellom foredragsholdere)
      </p>
      <h2>Som billettkjøper</h2>
      <h3>Autentisering</h3>
      <p>
        For å kjøpe må du ha en "godkjent" ethereum addresse. Dette får du ved å
        be admin om å legge inn din addresse inn i systemet som autentisert
      </p>
      <h3>Kjøpe konferansebillett</h3>
      <p>
        Hvis du er autentisert, kan du kjøpe billett{" "}
        <Link to="/tickets">her</Link>. Du kan bare kjøpe og eie 1 billett
      </p>
      <p></p>
      <h2>Som foredragsholder</h2>
      <h3>Melde deg opp som foredragsholder</h3>
      <p>Som foredragsholder får du en den av billettsalginntektene.</p>
      <p>
        Du kan melde deg på som foredragsholder <Link to="/speaker">her</Link>.
        Når konferansen er over kan du claime din betaling der også
      </p>
    </>
  );
};
