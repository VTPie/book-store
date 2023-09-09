import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GET_BOOKS, GET_AUTHORS, ADD_BOOK, ADD_AUTHOR } from '../graphql/graphql.queries'
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-book-store',
  templateUrl: './book-store.component.html',
  styleUrls: ['./book-store.component.scss']
})
export class BookStoreComponent implements OnInit {
  books: any[] = [];
  authors: any[] = [];

  constructor(private apollo: Apollo, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.apollo.watchQuery({
      query: GET_BOOKS
    }).valueChanges.subscribe(({ data, error }: any) => {
      this.books = data.books;
    }
    );
    this.apollo.watchQuery({
      query: GET_AUTHORS
    }).valueChanges.subscribe(({ data, error }: any) => {
      this.authors = data.authors;
    }
    );
  }

  bookForm = new FormGroup({
    name: new FormControl(''),
    category: new FormControl(''),
    authorID: new FormControl('')
  });
  checkBookData() {
    if (!this.bookForm.value.name || !this.bookForm.value.category || !this.bookForm.value.authorID) {
      this.toastr.error('Input cannot be empty.', 'Error');
      return 0
    }
    let id = +this.bookForm.value.authorID
    if (id > this.authors.length || id <= 0) {
      this.toastr.error('Author ID input must be greater than 0 and less than the number of authors.', 'Error');
      return 0
    }
    return 1
  }
  addBook() {
    const flag = this.checkBookData()
    if (flag === 0) { return }
    this.apollo.mutate({
      mutation: ADD_BOOK,
      variables: {
        name: this.bookForm.value.name,
        category: this.bookForm.value.category,
        authorID: this.bookForm.value.authorID,
      },
      refetchQueries: [{
        query: GET_BOOKS
      }]
    }).subscribe(({ data }: any) => {
      this.books = data.addBook;
      this.bookForm.reset();
    }
    );
    this.toastr.success('Added new book successfully.', 'Success');
  }

  authorForm = new FormGroup({
    name: new FormControl(''),
    homeTown: new FormControl(''),
  });
  checkAuthorData() {
    if (!this.authorForm.value.name || !this.authorForm.value.homeTown) {
      this.toastr.error('Input cannot be empty.', 'Error');
      return 0
    }
    return 1
  }
  addAuthor() {
    const flag = this.checkAuthorData()
    if (flag === 0) { return }
    this.apollo.mutate({
      mutation: ADD_AUTHOR,
      variables: {
        name: this.authorForm.value.name,
        homeTown: this.authorForm.value.homeTown,
      },
      refetchQueries: [{
        query: GET_AUTHORS
      }]
    }).subscribe(({ data }: any) => {
      this.authors = data.addAuthor;
      this.authorForm.reset();
    }
    );
    this.toastr.success('Added new author successfully.', 'Success');
  }
}
