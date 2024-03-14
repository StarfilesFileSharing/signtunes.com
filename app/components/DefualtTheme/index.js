import React from "react";
import Footer from "../Layout/Footer";
import Header from "../Layout/Header";

function DefaulTheme({ children }) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default DefaulTheme;
