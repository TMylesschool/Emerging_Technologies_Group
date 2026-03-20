import { useState } from "react";
import "./styles.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("news");

  return (
    <div className="app">
      <h1 className="title">Community Engagement Platform</h1>

      <div className="nav">
        {["news", "discussion", "help", "auth"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? "activeBtn" : "btn"}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="container">
        {activeTab === "news" && <News />}
        {activeTab === "discussion" && <Discussion />}
        {activeTab === "help" && <HelpRequests />}
        {activeTab === "auth" && <Auth />}
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function News() {
  return (
    <div>
      <Card title="Post News">
        <input className="input" placeholder="Title" />
        <textarea className="input" placeholder="Content" />
        <button className="primaryBtn">Submit</button>
      </Card>

      <Card title="Latest News">
        <p>Sample news post...</p>
      </Card>
    </div>
  );
}

function Discussion() {
  return (
    <div>
      <Card title="Start Discussion">
        <input className="input" placeholder="Title" />
        <textarea className="input" placeholder="Discussion content" />
        <button className="primaryBtn">Post</button>
      </Card>

      <Card title="Discussions">
        <p>Discussion thread...</p>
      </Card>
    </div>
  );
}

function HelpRequests() {
  return (
    <div>
      <Card title="Request Help">
        <textarea className="input" placeholder="Describe your issue" />
        <input className="input" placeholder="Location (optional)" />
        <button className="primaryBtn">Submit Request</button>
      </Card>

      <Card title="Open Requests">
        <p>Help request example...</p>
      </Card>
    </div>
  );
}

function Auth() {
  return (
    <div className="authGrid">
      <Card title="Login">
        <input className="input" placeholder="Email" />
        <input className="input" placeholder="Password" type="password" />
        <button className="primaryBtn">Login</button>
      </Card>

      <Card title="Signup">
        <input className="input" placeholder="Username" />
        <input className="input" placeholder="Email" />
        <input className="input" placeholder="Password" type="password" />
        <select className="input">
          <option>resident</option>
          <option>business_owner</option>
          <option>community_organizer</option>
        </select>
        <button className="primaryBtn">Signup</button>
      </Card>
    </div>
  );
}