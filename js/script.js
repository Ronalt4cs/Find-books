const input = document.querySelector('input');
const btnSearch = document.querySelector('.btn-search');
const btnClearAllBooks = document.querySelector('.btn-clear');
const main = document.querySelector('main');
const body = document.querySelector('body');

async function getBooks(inputValue) {
   const res = await api.get(`?q=${inputValue}`);

   try {
      return res.data;

   } catch (error) {
      console.log(error);
   }
}

const showFoundBooks = async (inputValue) => {
   const bookList = await getBooks(inputValue);
   const maxBookOnScreen = 8;

   if (main.children.length > 0) {
      main.innerHTML = '';
   }

   for (let i = 0; i < maxBookOnScreen; i++) {
      const containerBookImage = document.createElement('div');
      const bookImage = document.createElement('img');

      try {
         bookImage.src = bookList.items[i].volumeInfo.imageLinks.thumbnail;
         containerBookImage.classList.add('container');
         containerBookImage.appendChild(bookImage);
         containerBookImage.id = i;

         main.appendChild(containerBookImage);
      } catch (error) {
         if (error.type === undefined) {
            const bookTitle = document.createElement('h2');
            bookTitle.textContent = bookList.items[i].volumeInfo.title;
            bookTitle.classList.add('book-title');
            bookImage.src = 'https://books.google.com.br/googlebooks/images/no_cover_thumb.gif';

            containerBookImage.classList.add('container');
            containerBookImage.appendChild(bookTitle);
            containerBookImage.appendChild(bookImage);
            containerBookImage.id = i;

            main.appendChild(containerBookImage);
         }
      }
   }
}

btnSearch.addEventListener('click', () => {

   if (!input.value) {
      return
   }
   const inputValue = input.value
   showFoundBooks(inputValue);

   btnSearch.classList.add('btn-off');
   btnClearAllBooks.classList.remove('btn-off');
});

btnClearAllBooks.addEventListener('click', () => {
   btnSearch.classList.remove('btn-off');
   btnClearAllBooks.classList.add('btn-off');

   input.value = '';
   main.innerHTML = '';
});

body.addEventListener('keypress', (event) => {
   if (input.value && event.key === 'Enter') {
      const inputValue = input.value;
      btnSearch.classList.add('btn-off');
      btnClearAllBooks.classList.remove('btn-off');

      return showFoundBooks(inputValue);
   }
});

const modal = document.querySelector('.modal');
const modalThumb = document.querySelector('.modal-thumb');
const modalBookInfos = document.querySelector('.book-infos');
const btnCloseModal = document.querySelector('.btn-close-modal');
const btnMoreInfoModal = document.querySelector('.btn-more-infos');
const author = document.querySelector('.author-name');
const publisher = document.querySelector('.publisher');
const publishedDate = document.querySelector('.published-date');
const numberPages = document.querySelector('.number-pages');
const bookTitleModal = document.querySelector('.book-title-modal');
const bookDescription = document.querySelector('.book-description');
const containerBtnsModal = document.querySelector('.container-buttons');


const fillModal = async (bookId) => {

   const inputValue = input.value
   const res = await getBooks(inputValue);

   try {
      modalThumb.src = res.items[bookId].volumeInfo.imageLinks.thumbnail;
      author.textContent = res.items[bookId].volumeInfo.authors[0];
      publisher.textContent = res.items[bookId].volumeInfo.publisher;
      publishedDate.textContent = res.items[bookId].volumeInfo.publishedDate;
      numberPages.textContent = res.items[bookId].volumeInfo.pageCount;
      bookTitleModal.textContent = res.items[bookId].volumeInfo.title;
      bookDescription.textContent = res.items[bookId].volumeInfo.description;

   } catch (error) {

      if (error.type === undefined) {
         modalThumb.src = 'https://books.google.com.br/googlebooks/images/no_cover_thumb.gif';
         author.textContent = res.items[bookId].volumeInfo.authors[0];
         publisher.textContent = res.items[bookId].volumeInfo.publisher;
         publishedDate.textContent = res.items[bookId].volumeInfo.publishedDate;
         numberPages.textContent = res.items[bookId].volumeInfo.pageCount;
         bookTitleModal.textContent = res.items[bookId].volumeInfo.title;
         bookDescription.textContent = res.items[bookId].volumeInfo.description;
      }
   }

   btnMoreInfoModal.addEventListener('click', (event) => {
      event.stopPropagation();
      event.preventDefault();

      const moreInfosLink = res.items[bookId].volumeInfo.canonicalVolumeLink
      window.open(
         moreInfosLink,
         '_blank'
      );
   });
}

main.addEventListener('click', (event) => {
   event.stopPropagation();
   event.preventDefault();

   const bookId = event.path[1].id;
   fillModal(bookId);
   modal.classList.remove('hidden');
});

btnCloseModal.addEventListener('click', (event) => {
   event.stopPropagation();
   event.preventDefault();

   modal.classList.add('hidden');
   modalShow = false;
});
