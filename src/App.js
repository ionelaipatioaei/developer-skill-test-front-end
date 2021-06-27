import React, { Component } from "react";
import "./styles/App.scss";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ImageList from "./components/ImageList"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="app-container">
        <Header />
        <ImageList />
        <Footer />
      </div>
    );
  }
}


export default App;