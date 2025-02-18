import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context'; 

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',  
});

const authLink = (email, password) => {
  return setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        email,
        password,
      }
    };
  });
};

export const client = new ApolloClient({
  link: authLink(localStorage.getItem('email'), localStorage.getItem('password')).concat(httpLink),
  cache: new InMemoryCache(),
});
