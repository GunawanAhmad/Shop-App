const deleteBtn = document.querySelectorAll('.deleteBtn')
deleteBtn.forEach((btn)=> {
    btn.addEventListener('click',deleteProduct)
})

function deleteProduct() {
    let prodId =  this.parentElement.querySelector('[name=productId]').value;
    let csrf = this.parentElement.querySelector('[name=_csrf]').value;
    let product = this.parentElement.parentElement;

    fetch('/admin/deleteProduct/' + prodId, {
        method : 'DELETE',
        headers : {
            'csrf-token' : csrf
        }
    })
    .then(result => {
        return result.json()
    })
    .then((data) => {
        console.log(data)
        product.remove()
    })
    .catch(err => {
        console.log(err)
    })
}