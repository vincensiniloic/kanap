const params = new URLSearchParams(document.location.search);
// la variable id va récupérer la valeur du paramètre _id
const id = params.get("id");

// on fait un fetch avec l'id pour recuperer les informations du produit 
fetch(`http://localhost:3000/api/products/${id}`).then(response => response.json().then(data => {
    document.title = data.name
    printProduct(data)
}))
    .catch((err) => {
        let article = document.querySelector('article')
        article.innerHTML = '';
        let h1 = document.createElement('h1')
        h1.innerText = 'Erreur 404 - Not found'
        article.appendChild(h1)
    })

/*Recoit les informations du produit puis les affiches */
function printProduct(data) {

    let img = document.createElement('img');

    Object.assign(img, {
        src: `${data.imageUrl}`,
        alt: `${data.altTxt}`
    })
    document.querySelector(".item__img").appendChild(img);

    document.querySelector("#title").innerHTML = data.name;
    document.querySelector("#price").innerHTML = data.price;
    document.querySelector("#description").innerHTML = data.description;

    let options = document.querySelector("#colors");
    for (color of data.colors) {
        let option = document.createElement('option');
        option.innerText = color;
        option.setAttribute('value', `${color}`)
        options.appendChild(option)
    }
    let button = document.querySelector("#addToCart");

    button.addEventListener("click", () => {
        data.colors = document.querySelector("#colors").value;
        let quantity = parseInt(document.querySelector("#quantity").value);
        let products = JSON.parse(localStorage.getItem("product"));

        if (products) {
            data.quantity = quantity
            // On vérifie que la couleur et la qtité sont correctes avant d'ajouter le produit au panier
            if (verifyCQ(data.colors, data.quantity)) {
                addToCart(products, data)
            }
            else {
                alert('Veuillez renseigner tout les champs ! ')
            }
        }
        else {
            if (verifyCQ(data.colors, data.quantity)) {
                products = [];
                data.quantity = quantity;
                addToCart(products, data)
            }
            else {
                alert('Veuillez renseigner tout les champs ! ')
            }
        }
    })
}

/* On check dans le panier si le produit y est déjà si oui on additionne les quantité sinon on ajoute le produit
*/
function addToCart(products, data) {
    let k = 0;
    for (let i = 0; i < products.length; i++) {
        if (products[i].colors == data.colors && products[i]._id == data._id) {
            products[i].quantity += data.quantity;
            tri(products);
            localStorage.setItem("product", JSON.stringify(products));
            k++
        }
    }

    if (k === 0) {
        products.push(data);
        tri(products);
        localStorage.setItem("product", JSON.stringify(products));
    }
    alert(data.name + " " + data.colors + " ajouté au panier ! ")
}

// tri le tableau par id et par couleur
function tri(tab) {
    tab.sort(function compare(a, b) {
        if (a._id < b._id) return -1;
        if (a._id > b._id) return 1;
        if (a._id = b._id) {
            if (a.colors < b.colors) return -1;
            if (a.colors > b.colors) return 1;
        }
        return 0;
    });
}
/* On verifie que la couleur et la quantité sont correctes si oui on retourne vrai sinon faux */
function verifyCQ(color, quantity) {
    if (color == "" || quantity == 0) {
        return false
    }
    else return true
}