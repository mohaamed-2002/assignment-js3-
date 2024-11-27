const body = document.querySelector('body');
const siteName = document.querySelector('#bookmarkName');
const siteURL = document.querySelector('#bookmarkURL');
const submitBtn = document.querySelector('#submitBtn');
const tableContent = document.querySelector('#tableContent');

let bookmarks = [];

const messagesAlert = {
    msgError: {
        text: "The Site Name or URL is not valid."
    },
    
    msgSusses: {
        title: "Great work",
        text: "You've successfully added a bookmark.",
    },
    msgConfirm: {
        text: "You are about to delete this website. This action cannot be undone.",
        confirmButtonText: "Yes, delete it!"
    },
    msgDelete: {
        title: "Deleted!!",
        text: "Your site has been deleted.",
    }
}

function toggleClass(el, className, condition) {
    condition ? el.classList.add(className) : el.classList.remove(className);
}

function setLocalstorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
}

function getLocalstorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

const siteNameRegex = /^([a-z]{3})[a-z]*$/i;
const siteURLRegex = /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;

function validationInput(regex, element) {
    const valid = regex.test(element.value);
    toggleClass(element, "is-valid", valid);
    toggleClass(element, "is-invalid", !valid);
    return valid;
}


function clearInput() {
    siteName.value = "";
    siteURL.value = "";
    toggleClass(siteName, "is-valid", false);
    toggleClass(siteURL, "is-valid", false);
}

function Display(bookmarksArray) {
    document.querySelector('#tableSection').style.display = 'block';
    tableContent.innerHTML = '';
    let contentTable = '';
    for (let i = 0; i < bookmarksArray.length; i++) {
      contentTable += `<tr>
      <td scope="row" class="fw-semibold">${i + 1}</td>
      <td class="fw-semibold text-capitalize">${bookmarksArray[i].siteName}</td>              
      <td><button class="btn btn-success btn-sm"  onclick="visitBookmark('${bookmarksArray[i].siteURL}')" data-index="${bookmarksArray[i].siteURL}"><i class="icon-eye1 pe-1 icon-btn"></i>Visit</button></td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteBookmark(${bookmarksArray[i].index})" data-index="${bookmarksArray[i].index}"><i class="icon-bin pe-1 icon-btn"></i>Delete</button></td>
    </tr>`;
    };
    tableContent.innerHTML = contentTable;
}

function addToBookmarks(bookmark) {
    bookmarks.push(bookmark);
    setLocalstorage('bookmarksList', bookmarks);
    Display(bookmarks);
}

function deleteBookmark(index) {
    Swal.fire(messagesAlert.msgConfirm)
        .then((result) => {
            if (result.isConfirmed) {
                siteIndex = bookmarks.indexOf(bookmarks.find(site => site.index === index))
                bookmarks.splice(siteIndex, 1);
                Localstorage.setItem('bookmarksList', bookmarks);
                Display(bookmarks);
                if (bookmarks.length < 1) { document.querySelector('#tableSection').style.display = 'none'; }
                Swal.fire(messagesAlert.msgDelete);
            }
        });
}

function visitBookmark(url) {
    window.open(url, '_blank');
}

submitBtn.addEventListener('click', () => {
    let nameValid = validationInput(siteNameRegex, siteName);
    let urlValid = validationInput(siteURLRegex, siteURL);
    if (nameValid && urlValid) {
        let bookmark = { index: bookmarks.length, siteName: siteName.value, siteURL: siteURL.value };
        addToBookmarks(bookmark);
        clearInput();
        Swal.fire(messagesAlert.msgSusses);
    } else {
        Swal.fire(messagesAlert.msgError);
    }
});

siteName.addEventListener("input", () => {
    validationInput(siteNameRegex, siteName);
});

siteURL.addEventListener("input", () => {
    validationInput(siteURLRegex, siteURL);
});