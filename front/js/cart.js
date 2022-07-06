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

  /**---CREATION DES ELEMENTS ---**/
  let article = document.createElement("article");

  let div_img = document.createElement("div");
  let div_content = document.createElement("div");
  let div_description = document.createElement("div");
  let div_settings = document.createElement("div");
  let div_quantity = document.createElement("div");
  let div_delete = document.createElement("div");

  let img = document.createElement('img');
  let h2 = document.createElement('h2');
  let input_quantity = document.createElement('input')

  let p_colors = document.createElement('p');
  let p_price = document.createElement('p');
  let p_quantity = document.createElement('p');
  let p_delete = document.createElement('p');

  /**---setAttributs sur les elements ---**/
  article.setAttribute("class", 'cart__item')
  article.setAttribute("data-id", `${product._id}`)
  article.setAttribute("data-color", `${product.colors}`)

  Object.assign(img, {
    src: `${product.imageUrl}`,
    alt: `${product.altTxt}`
  })

  Object.assign(input_quantity, {
    type: "number",
    className: "itemQuantity",
    name: "itemQuantity",
    min: "1",
    max: "100",
    value: `${product.quantity}`
  })

  div_img.setAttribute("class", "cart__item__img")
  div_content.setAttribute("class", "cart__item__content")
  div_description.setAttribute("class", "cart__item__content__description")
  div_settings.setAttribute("class", "cart__item__content__settings")
  div_quantity.setAttribute("class", "cart__item__content__settings__quantity")
  div_delete.setAttribute("class", "cart__item__content__settings__delete")


  p_colors.setAttribute("id", "colors")
  p_price.setAttribute("id", "price")
  p_quantity.setAttribute("id", "quantity")
  p_delete.setAttribute("class", "deleteItem")

  /**---innerText---**/

  h2.innerText = `${product.name}`
  p_colors.innerText = `${product.colors}`
  p_price.innerText = `${product.price} x ${product.quantity} = ${product.price * product.quantity} €`
  p_quantity.innerText = "Qté : "
  p_delete.innerText = "Supprimer"

  /**---appendChild---**/
  div_img.appendChild(img)
  div_quantity.appendChild(p_quantity)
  div_quantity.appendChild(input_quantity)

  div_delete.appendChild(p_delete)

  div_description.appendChild(h2)
  div_description.appendChild(p_colors)
  div_description.appendChild(p_price)

  div_settings.appendChild(div_quantity)
  div_settings.appendChild(div_delete)
  div_content.appendChild(div_description, div_settings)
  div_content.appendChild(div_settings)

  article.appendChild(div_img)
  article.appendChild(div_content)

  document.getElementById('cart__items').appendChild(article);
  totalQuantity += parseInt(product.quantity);
  totalPrice += product.price * product.quantity;
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
let regexAddress = new RegExp("^[a-zA-Z0-9_.+-]")

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
    else document.getElementById(errorSelector[i]).innerHTML = errorMsg[i]
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
      window.location.href = `confirmation.html?commande=${data.orderId}`;
    })
    .catch(function (err) {
      console.log(err);
      alert("erreur");
    });

}