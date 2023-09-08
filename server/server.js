const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
} = require('graphql')
const app = express()

// Dữ liệu mẫu, tương ứng như DB cho app.
const books = [
    { id: 1, name: 'Chí Phèo', category: 'Truyện ngắn', authorID: 1 },
    { id: 2, name: 'Lão Hạc', category: 'Truyện ngắn', authorID: 1 },
    { id: 3, name: 'Truyện Kiều', category: 'Thơ', authorID: 2 },
    { id: 4, name: 'Văn tế thập loại chúng sinh', category: 'Thơ', authorID: 2 },
    { id: 5, name: 'Số đỏ', category: 'Tiểu thuyết', authorID: 3 },
    { id: 6, name: 'Làm đĩ', category: 'Tiểu thuyết', authorID: 3 },
    { id: 7, name: 'Hoa hướng dương', category: 'Truyện dài', authorID: 4 },
    { id: 8, name: 'Cá bống mú', category: 'Truyện dài', authorID: 4 },
    { id: 9, name: 'Dế mèn phiêu lưu ký', category: 'Văn xuôi', authorID: 5 },
    { id: 10, name: 'Vợ chồng A Phủ', category: 'Truyện ngắn', authorID: 5 },
]
const authors = [
    { id: 1, name: 'Nam Cao', homeTown: 'Hà Nam' },
    { id: 2, name: 'Nguyễn Du', homeTown: 'Bích Câu' },
    { id: 3, name: 'Vũ Trọng Phụng', homeTown: 'Hà Nội' },
    { id: 4, name: 'Đoàn Giỏi', homeTown: 'Tiền Giang' },
    { id: 5, name: 'Tô Hoài', homeTown: 'Hà Nội' },
]

// Tạo ra các custom type được sử dụng trong Query
const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'This represents a book written by an author',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        category: { type: new GraphQLNonNull(GraphQLString) },
        authorID: { type: new GraphQLNonNull(GraphQLInt) },
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorID)
            }
        }
    })
})
const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This represents an author of a book',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        homeTown: { type: new GraphQLNonNull(GraphQLString) },
        books: {
            type: new GraphQLList(BookType),
            resolve: (author) => {
                return books.filter(book => book.authorID === author.id)
            }
        }
    })
})

// Tạo Query cho app.
// Query được sử dụng để đọc hoặc nhận các giá trị được chỉ định từ GraphQL server.
// 1 Query gồm có: name (tên của Query), description (mô tả của Query) và fields (các method để đọc data).
const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        // Được gọi khi cần truy vấn 1 danh sách books.
        books: {
            type: new GraphQLList(BookType),
            description: 'List of all book',
            resolve: () => books
        },
        // Được gọi khi cần truy vấn 1 danh sách authors.
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of all authors',
            resolve: () => authors
        },
        // Được gọi khi cần truy vấn 1 book.
        book: {
            type: BookType,
            description: 'A single book',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)
        },
        // Được gọi khi cần truy vấn 1 author.
        author: {
            type: AuthorType,
            description: 'A single author',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => authors.find(author => author.id === args.id)
        },
    })
})

// Tạo Mutation.
// Mutation dùng để tạo, xóa hoặc cập nhật dữ liệu.
const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addBook: {
            type: BookType,
            description: 'Add a book',
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                category: { type: new GraphQLNonNull(GraphQLString) },
                authorID: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                const book = {
                    id: books.length + 1,
                    name: args.name,
                    category: args.category,
                    authorID: args.authorID
                }
                books.push(book)
                return book
            }
        },
        addAuthor: {
            type: AuthorType,
            description: 'Add an author',
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                homeTown: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                const author = {
                    id: authors.length + 1,
                    name: args.name,
                    homeTown: args.homeTown
                }
                authors.push(author)
                return author
            }
        },
    })
})

// Tạo Schema
// Schema dùng để mô tả type và cấu trúc của dữ liệu trong ứng dụng.
const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))
app.listen(4000, () => console.log("Server running on port 4000."))
