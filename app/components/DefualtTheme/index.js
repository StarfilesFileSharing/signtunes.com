import React, { Suspense } from "react";
import Footer from "../Layout/Footer";
import Header from "../Layout/Header";

function DefaultTheme({ children }) {
  return (
    <div>
      {children}
      <Footer />
    </div>
  );
}

export default DefaultTheme;
