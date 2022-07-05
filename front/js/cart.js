let products = JSON.parse(localStorage.getItem('product'));
totalPrice = 0;
totalQuantity = 0;

/* Si le panier n'est pas vide alors on appele la fonction printArticle en lui passant en paramètre un produit.
   Si le panier est vide on n'affiche 'pannier vide' et on cache le formulaire
*/
if (products && products.length > 0) {
  //pour chaque produit du panier on appele la fonction printArticle pour l'afficher
  for (product of products) {
    printArticle(product)
    console.log(product)
  }
  setDeleteButton();
  setQuantityButton();
}
else {
  document.querySelector("#cart__items").innerHTML = "<h2>Votre panier est vide...</h2>"
  document.querySelector(".cart__order").innerHTML = ""
  document.querySelector(".cart__price").innerHTML = ""
}

/* Cette fonction récupère les données d'un produit puis les affiche sur la page */
function printArticle(product) {

  totalQuantity += parseInt(product.quantity);
  totalPrice += product.price * product.quantity;

  let article = document.querySelector("#cart__items")
  article.innerHTML +=
    `<article class="cart__item" data-id="${product._id}" data-couleur="${product.colors}" data-quantité="${product.quantity}"> 
<div class="cart__item__img">
  <img src="${product.imageUrl}" alt="${product.altTxt}"/>
</div>
<div class="cart__item__content">
  <div class="cart__item__content__titlePrice">
    <h2>${product.name}</h2>
    <span>couleur : ${product.colors}</span>
    <p data-prix="${product.price}">${product.price} €</p>
  </div>
  <div class="cart__item__content__settings">
    <div class="cart__item__content__settings__quantity">
      <p>Qté : </p>
      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
    </div>
    <div class="cart__item__content__settings__delete">
      <p class="deleteItem" data-id="${product._id}" data-couleur="${product.colors}">Supprimer</p>
    </div>
  </div>
</div>
</article>`;
  document.querySelector("#totalPrice").innerHTML = totalPrice;
  document.querySelector("#totalQuantity").innerHTML = parseInt(totalQuantity)

}

/* Récupère tous les boutons 'supprimer' de la page et ajoute un écouteur d'evenement (clic) sur chacun d'eux.
   Ce qui permmettra de supprimer le bon article lorsqu'on cliquera sur le bouton.
*/
function setDeleteButton() {
  delButton = document.querySelectorAll(".deleteItem");
  for (let i = 0; i < delButton.length; i++) {
    delButton[i].addEventListener("click", (e) => {
      e.preventDefault();
      products.splice(i, 1);
      localStorage.setItem("product", JSON.stringify(products));
      location.reload()
    })
  }
}




/* Récupère tous les inputs de quantités de la page et ajoute un écouteur d'évènement (change) sur chacun d'eux.
   Ce qui permettra de mettre à jour la quantité du produit lorsque l'utilisateur modifie la quantité
*/
function setQuantityButton() {
  inputButton = document.querySelectorAll(".itemQuantity");
  for (let i = 0; i < inputButton.length; i++) {
    inputButton[i].addEventListener("change", () => {
      let selectedProduct = products[i];
      selectedProduct.quantity = inputButton[i].value;
      localStorage.setItem("product", JSON.stringify(products));
      location.reload()
      if (inputButton[i].value < 1) {
        alert("la quantité ne peux pas être nulle")
        selectedProduct.quantity = 1;
        localStorage.setItem("product", JSON.stringify(products));
        location.reload()

      }
    })
  }
}

//------LE FORMULAIRE------//

const form = document.getElementById('form');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const address = document.getElementById('address');
const city = document.getElementById('city');
const email = document.getElementById('email');

let regexName = new RegExp("^([ \u00c0-\u01ffa-zA-Z'\-])+$")
let regexCity = new RegExp("^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$")
let regexMail = new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
let regexAddress = new RegExp("")

const regexTab = [regexName, regexName, regexAddress, regexCity, regexMail];
const fields = [firstName, lastName, address, city, email];
const errorSelector = ["firstNameErrorMsg", "lastNameErrorMsg", "addressErrorMsg", "cityErrorMsg", "emailErrorMsg"]
const errorMsg = ["Veuillez saisir un prénom correct ! ", "Veuillez saisir un nom correct ! ", "Veuillez saisir une adresse correcte ! ", "Veuillez saisir une ville correcte ! ", "Veuillez saisir une adresse e-mail correcte ! "]




form.addEventListener('submit', e => {
  e.preventDefault();
  if (verifyFields() && products.length > 0) {
    const contactProducts = []
    for (product of products) {
      contactProducts.push(product._id);
    }
    const contact = {
      firstName: firstName.value,
      lastName: lastName.value,
      address: address.value,
      city: city.value,
      email: email.value
    };
    order(contact, contactProducts);
  }
  else {
    if (products.length == 0 || !products) {
      alert("Veuillez ajouter des articles au panier !")
    }
  }
})


/* Verifie que tous les champs sont valide en utilisant leur regex respectifs grace a l'utilisation des tableaux */
function verifyFields() {
  let k = 0
  for (let i = 0; i < fields.length; i++) {
    let regexResult = regexTab[i].test(fields[i].value);
    if (regexResult == true) {
      document.getElementById(errorSelector[i]).innerHTML = ""
      k++
    }
    else {
      document.getElementById(errorSelector[i]).innerHTML = errorMsg[i]
    }
  }
  if (k == fields.length) return true
  else return false
}

/* Récupère les données du formulaire qui ont été validés et le panier puis envoie une requete à l'API avec fetch
   Puis renvoie vers la page de confirmation avec l'id de commande
 */
function order(contact, products) {
  commande = {
    contact: contact,
    products: products
  };

  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commande),
  })
    .then((res) => (res.json()))
    .then((data) => {
      // envoyé à la page confirmation, autre écriture de la valeur "./confirmation.html?commande=${data.orderId}"
      console.log(window.location)
      window.location.href = `confirmation.html?commande=${data.orderId}`;
    })
    .catch(function (err) {
      console.log(err);
      alert("erreur");
    });

}