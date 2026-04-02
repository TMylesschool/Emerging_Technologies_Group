import Container from 'react-bootstrap/Container';
import AIChatbot from './components/AIChatbot';

function App() {
  return (
    <div className="app-shell">
      <Container className="py-4 py-md-5 app-container">
        <header className="hero-panel mb-4">
          <p className="eyebrow">Exercise 1</p>
          <h1>Community Engagement AI Assistant</h1>
          <p className="hero-copy">
            Ask community-related questions, explore AI-generated follow-ups, and review
            relevant discussion posts in one responsive interface.
          </p>
        </header>
        <AIChatbot />
      </Container>
    </div>
  );
}

export default App;
