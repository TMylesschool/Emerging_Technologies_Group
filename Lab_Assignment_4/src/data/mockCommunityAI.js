const postLibrary = [
  {
    id: '1',
    title: 'Night patrol volunteers are expanding their routes',
    content:
      'Residents are discussing how extra volunteer walks could improve visibility near parks and bus stops.',
    author: 'Marina',
    category: 'Safety',
    createdAt: '2026-03-28',
  },
  {
    id: '2',
    title: 'Street lighting request near Cedar Avenue',
    content:
      'Several community members requested brighter lighting after sunset and shared photos of dark intersections.',
    author: 'Andre',
    category: 'Safety',
    createdAt: '2026-03-25',
  },
  {
    id: '3',
    title: 'Weekend clean-up and mural planning thread',
    content:
      'Volunteers are coordinating a neighbourhood clean-up and a mural concept for the community centre wall.',
    author: 'Talia',
    category: 'Events',
    createdAt: '2026-03-22',
  },
  {
    id: '4',
    title: 'Transit delays affecting evening commuters',
    content:
      'People are sharing alternate routes and asking the city for more reliable evening service updates.',
    author: 'Jordan',
    category: 'Transit',
    createdAt: '2026-03-30',
  },
];

function buildResponse(input) {
  const question = input.trim();
  const normalized = question.toLowerCase();

  const matchingPosts = postLibrary.filter((post) => {
    const haystack = `${post.title} ${post.content} ${post.category}`.toLowerCase();
    return normalized
      .split(/\s+/)
      .filter(Boolean)
      .some((term) => haystack.includes(term));
  });

  if (!question) {
    return {
      text: 'Please enter a community-related question so I can help.',
      suggestedQuestions: [],
      retrievedPosts: [],
    };
  }

  if (normalized.includes('safety')) {
    return {
      text:
        'Current safety discussions focus on improved street lighting, volunteer patrols, and better visibility around transit stops.',
      suggestedQuestions: [
        'Which safety topics are getting the most attention?',
        'What actions are residents suggesting for dark intersections?',
        'Are there any upcoming safety meetings or patrol events?',
      ],
      retrievedPosts: matchingPosts.length ? matchingPosts : postLibrary.slice(0, 2),
    };
  }

  if (matchingPosts.length) {
    return {
      text:
        'I found related community conversations that match your question. You can review the posts below and ask a follow-up to dig deeper.',
      suggestedQuestions: [
        'Can you summarize the concerns people are raising?',
        'What follow-up questions should I ask the community?',
        'Which post seems most relevant to this topic?',
      ],
      retrievedPosts: matchingPosts,
    };
  }

  return {
    text:
      'I could not find a strong topical match in the demo data, but I can still help refine your question for better retrieval.',
    suggestedQuestions: [
      'Can you show me discussions about safety, transit, or local events?',
      'What are people currently concerned about in the neighbourhood?',
      'How should I rephrase my question for better results?',
    ],
    retrievedPosts: postLibrary.slice(0, 3),
  };
}

export function mockCommunityAIQuery(input) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(buildResponse(input)), 650);
  });
}
