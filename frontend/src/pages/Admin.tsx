import React from "react";
import { AuthAddress } from "../components/AuthAddress";
import { ClaimReward } from "../components/ClaimReward";
import { CloseRegistration } from "../components/CloseRegistration";
import { GiveTicket } from "../components/GiveTicket";

interface Props {}
export const Admin: React.FC<Props> = () => {
  return (
    <>
      <AuthAddress />
      <CloseRegistration />
      <ClaimReward />
      <GiveTicket />
    </>
  );
};
