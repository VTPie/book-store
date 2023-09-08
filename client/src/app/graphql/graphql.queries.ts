import { gql } from 'apollo-angular'

const GET_BOOKS = gql`
  query {
    books {
      id
      name
      category
      author{
        name
      }
    }
  }
`
const GET_AUTHORS = gql`
  query {
    authors {
      id
      name
      homeTown
    }
  }
`
const ADD_BOOK = gql`
  mutation addBook($name: String!, $category: String!, $authorID: Int!) {
    addBook(name: $name, category: $category, authorID: $authorID) {
      id
      name
      category
      authorID
    }
  }
`
const ADD_AUTHOR = gql`
  mutation addAuthor($name: String!, $homeTown: String!) {
    addAuthor(name: $name, homeTown: $homeTown) {
      id
      name
      homeTown
    }
  }
`

export { GET_BOOKS, GET_AUTHORS, ADD_BOOK, ADD_AUTHOR }
