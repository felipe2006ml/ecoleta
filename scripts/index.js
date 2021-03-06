const buttonSearch = document.querySelector('#page-home main a')
const modal = document.querySelector('#modal')
const closeBtn = document.querySelector('#modal .header a')

buttonSearch.addEventListener('click', function() {
    modal.classList.remove('hide')
})

closeBtn.addEventListener('click', function() {
    modal.classList.add('hide')
})