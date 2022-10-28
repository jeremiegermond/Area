import "./Connect.css";
import React from "react";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const auth = cookies.get("TOKEN");

export default class Connect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {reddit: false}
  }

  hasApi = async (api) => {
    await axios
    .get(`${process.env.REACT_APP_API_URL}/user/hasApi/${api}`, {
      headers: { Authorization: `Bearer ${auth}` },
    })
    .then((res) => {
      return res.data;
    }).catch((e) => {
      return false;
    })
  };

  componentDidMount() {
    const reddit = this.hasApi("reddit")
    this.setState({reddit: reddit})
  }

  handleSubmitTwitter = async (event) => {
    event.preventDefault();
    await axios
      .get(`${process.env.REACT_APP_API_URL}/user/twitter/addAccount`, {
        headers: { Authorization: `Bearer ${auth}` },
      })
      .then((res) => {
        console.log(res.status);
        console.log(res.data);
        window.location.href = res.data["path"];
      });
  };

  handleSubmitReddit = async (event) => {
    event.preventDefault();
    await axios
      .get(`${process.env.REACT_APP_API_URL}/user/reddit/addAccount`, {
        headers: { Authorization: `Bearer ${auth}` },
      })
      .then((res) => {
        console.log(res.status);
        console.log(res.data);
        window.location.href = res.data["path"];
      });
  };

  handleSubmitTwitch = async (event) => {
    event.preventDefault();
    await axios
      .get(`${process.env.REACT_APP_API_URL}/user/twitch/addAccount`, {
        headers: { Authorization: `Bearer ${auth}` },
      })
      .then((res) => {
        console.log(res.status);
        console.log(res.data);
        window.location.href = res.data["path"];
      });
  };

  render() {
    return (
      <section className="connect-page">
        <h1>Connect to your API's</h1>
        <h3>By doing this, you consent the usage of your data</h3>
        <div className="api-buttons">
          <input
            type="submit"
            value="Twitch"
            className="api-btn"
            onClick={this.handleSubmitTwitch}
          />
          <input
            type="submit"
            value="Reddit"
            className="api-btn"
            onClick={this.handleSubmitReddit}
          />
          <input
            type="submit"
            value="Twitter"
            className="api-btn"
            onClick={this.handleSubmitTwitter}
          />
        </div>
        <h6>Back to <a href='../home'>home</a></h6>
      </section>
    );
  }
}
