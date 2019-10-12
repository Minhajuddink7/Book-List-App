// Book class: represents a book

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI class: handles UI

class UI {
  static displayBooks() {
    const books = Storage.getBooks();
    books.forEach(book => {
      UI.addBooksToList(book);
    });
  }
  static addBooksToList(book) {
    const books = Storage.getBooks();
    const list = document.getElementById("book-list");
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
      `;
    list.appendChild(row);
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);
    // vanish after 3 seconds

    setTimeout(() => document.querySelector(".alert").remove(), 2000);
  }
  static removeBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }
  static clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }
}

// Store class: Deals with storage

class Storage {
  // get books from storage
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  // add books to local storage
  static addBooks(book) {
    const books = Storage.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  //remove book from local storage
  static removeBook(isbn) {
    const books = Storage.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event: Display Books

document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: Add a Book from form

document.querySelector("#book-form").addEventListener("submit", e => {
  // Prevent default submit

  e.preventDefault();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const isbn = document.getElementById("isbn").value;
  const book = new Book(title, author, isbn);

  if (title == "" || author == "" || isbn == "") {
    UI.showAlert("Please fill all the fields!", "danger");
  } else {
    // Add book to UI

    UI.addBooksToList(book);
    // Add book to Store
    Storage.addBooks(book);

    // Notify
    UI.showAlert("Book added !", "success");

    // Clear all the fields

    UI.clearFields();
  }
});

// Remove a Book
document.getElementById("book-list").addEventListener("click", e => {
  UI.removeBook(e.target);

  // remove from storage
  Storage.removeBook(e.target.parentElement.previousElementSibling.textContent);
  // Notify
  UI.showAlert("Book deleted!", "success");
});
