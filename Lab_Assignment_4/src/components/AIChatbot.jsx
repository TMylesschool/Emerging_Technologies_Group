import { useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import { useLazyQuery } from '@apollo/client';
import { COMMUNITY_AI_QUERY } from '../graphql/communityQueries';
import { mockCommunityAIQuery } from '../data/mockCommunityAI';

const starterPrompts = [
  'What are people discussing about safety?',
  'Are there any community events this weekend?',
  'What concerns are residents sharing about transit?',
];

function MessageBubble({ message }) {
  return (
    <div className={`message-row ${message.role === 'user' ? 'user-row' : 'assistant-row'}`}>
      <div className={`message-bubble ${message.role}`}>
        <p className="message-text mb-0">{message.text}</p>
      </div>
    </div>
  );
}

function RetrievedPostCard({ post }) {
  return (
    <Card className="post-card h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
          <Badge bg="light" text="dark" className="post-badge">
            {post.category || 'Community'}
          </Badge>
          <span className="post-date">{post.createdAt || 'Recent'}</span>
        </div>
        <Card.Title>{post.title}</Card.Title>
        <Card.Text>{post.content}</Card.Text>
      </Card.Body>
      <Card.Footer className="post-footer">Posted by {post.author || 'Anonymous'}</Card.Footer>
    </Card>
  );
}

function AIChatbot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Ask me about neighbourhood discussions and I will surface relevant conversations with suggested follow-up questions.',
    },
  ]);
  const [suggestedQuestions, setSuggestedQuestions] = useState(starterPrompts);
  const [retrievedPosts, setRetrievedPosts] = useState([]);
  const [surfaceError, setSurfaceError] = useState('');

  const useMockMode = useMemo(
    () => (import.meta.env.VITE_USE_MOCK_CHAT || 'true').toLowerCase() !== 'false',
    [],
  );
  const visiblePosts = retrievedPosts.slice(0, 2);

  const [runCommunityQuery, { loading }] = useLazyQuery(COMMUNITY_AI_QUERY, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      const response = data?.communityAIQuery;
      if (!response) {
        setSurfaceError('The API returned no chatbot data.');
        return;
      }

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: response.text,
        },
      ]);
      setSuggestedQuestions(response.suggestedQuestions || []);
      setRetrievedPosts(response.retrievedPosts || []);
      setSurfaceError('');
    },
    onError: () => {
      setSurfaceError(
        'The GraphQL service is unavailable right now. Enable mock mode or start the backend later.',
      );
    },
  });

  const submitQuestion = async (questionText) => {
    const trimmedQuestion = questionText.trim();
    if (!trimmedQuestion || loading) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: `user-${Date.now()}`,
        role: 'user',
        text: trimmedQuestion,
      },
    ]);
    setInput('');

    if (useMockMode) {
      const response = await mockCommunityAIQuery(trimmedQuestion);
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: response.text,
        },
      ]);
      setSuggestedQuestions(response.suggestedQuestions || []);
      setRetrievedPosts(response.retrievedPosts || []);
      setSurfaceError('');
      return;
    }

    runCommunityQuery({
      variables: {
        input: trimmedQuestion,
      },
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await submitQuestion(input);
  };

  return (
    <Row className="g-4 align-items-start">
      <Col lg={7}>
        <Card className="chat-panel">
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <p className="section-tag mb-1">Chat</p>
                <h2 className="panel-title mb-0">Community AI Chatbot</h2>
              </div>
              <Badge bg={useMockMode ? 'warning' : 'success'} className="mode-badge">
                {useMockMode ? 'Mock UI Mode' : 'GraphQL Mode'}
              </Badge>
            </div>

            <div className="chat-log">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {loading && (
                <div className="message-row assistant-row">
                  <div className="message-bubble assistant loading-bubble">
                    <Spinner animation="border" size="sm" className="me-2" />
                    Thinking through community discussions...
                  </div>
                </div>
              )}
            </div>

            <Form onSubmit={handleSubmit} className="mt-4">
              <Form.Label htmlFor="community-question" className="fw-semibold">
                Ask a question
              </Form.Label>
              <div className="composer">
                <Form.Control
                  id="community-question"
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="What are people discussing about safety?"
                />
                <Button type="submit" disabled={loading}>
                  Send
                </Button>
              </div>
            </Form>

            <div className="prompt-cloud mt-4">
              {starterPrompts.map((prompt) => (
                <Button
                  key={prompt}
                  variant="outline-dark"
                  className="prompt-chip"
                  onClick={() => submitQuestion(prompt)}
                  disabled={loading}
                >
                  {prompt}
                </Button>
              ))}
            </div>

            {surfaceError && (
              <Alert variant="danger" className="mt-4 mb-0">
                {surfaceError}
              </Alert>
            )}
          </Card.Body>
        </Card>
      </Col>

      <Col lg={5}>
        <Card className="side-panel">
          <Card.Body className="p-4">
            <p className="section-tag mb-1">Posts</p>
            <h3 className="panel-title h4">Relevant community posts</h3>
            <Row className="g-3 mt-1">
              {visiblePosts.length ? (
                visiblePosts.map((post) => (
                  <Col xs={12} key={post.id}>
                    <RetrievedPostCard post={post} />
                  </Col>
                ))
              ) : (
                <Col xs={12}>
                  <div className="empty-state">
                    Submit a question to display the most relevant discussion posts here.
                  </div>
                </Col>
              )}
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default AIChatbot;
