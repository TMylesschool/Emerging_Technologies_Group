import { gql } from '@apollo/client';

export const COMMUNITY_AI_QUERY = gql`
  query CommunityAIQuery($input: String!) {
    communityAIQuery(input: $input) {
      text
      suggestedQuestions
      retrievedPosts {
        id
        title
        content
        author
        category
        createdAt
      }
    }
  }
`;
