import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GET_BOOKS, GET_AUTHORS, ADD_BOOK, ADD_AUTHOR } from '../graphql/graphql.queries'

@Component({
  selector: 'app-book-store',
  templateUrl: './book-store.component.html',
  styleUrls: ['./book-store.component.scss']
})
export class BookStoreComponent implements OnInit {
  books: any[] = [];
  authors: any[] = [];
  error: any;

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.apollo.watchQuery({
      query: GET_BOOKS
    }).valueChanges.subscribe(({ data, error }: any) => {
      this.books = data.books;
      this.error = error;
    }
    );
    this.apollo.watchQuery({
      query: GET_AUTHORS
    }).valueChanges.subscribe(({ data, error }: any) => {
      this.authors = data.authors;
      this.error = error;
    }
    );
  }
}
