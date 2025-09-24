import React from "react";
import Header from "../../../layouts/Header/Header";
import Banner from "./Banner";
import MovieList from "../movielist/MovieList";
import Footer from "../../../layouts/Footer/Footer";

function Home() {
  return (
    <>
      <Header />

      <Banner />

      {/* Movie List */}
      <MovieList />

      <Footer />
    </>
  );
}

export default Home;
