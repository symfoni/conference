import React from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <div style={styles.header}>
      <Link style={styles.headerLink} to="/">
        Hjem
      </Link>
      <Link style={styles.headerLink} to="/admin">
        Admin
      </Link>
      <Link style={styles.headerLink} to="/tickets">
        Kjøp billetter
      </Link>
      <Link style={styles.headerLink} to="/speakers">
        For foredragsholdere
      </Link>
    </div>
  );
};

const styles = {
  header: {
    display: "flex",
    height: "100px",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  headerLink: {
    color: "white",
    textDecoration: "none",
    padding: "0 15px",
  },
};

export default Navbar;
