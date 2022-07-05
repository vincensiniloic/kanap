const params = new URLSearchParams(document.location.search);
// la variable id va récupérer la valeur du paramètre _id
const id = params.get("_id");

// on fait un fetch avec l'id pour recuperer les informations du produit 
fetch(`http://localhost:3000/api/products/${id}`).then(response => response.json().then(data => {
    document.title = data.name
    printProduct(data)
}))

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
            products = [];
            data.quantity = quantity;
            if (verifyCQ(data.colors, data.quantity)) {
                addToCart(products, data)
            }
            else {
                alert('Veuillez renseigner tout les champs ! ')
            }
        }
    })
}

/* Ajoute au panier un produit, tri le panier puis verifie si le produit est déjà présent si oui on additionne les 2 quantités
    et on garde une seule ligne dans le panier
*/
function addToCart(products, data) {
    products.push(data);
    products.sort(function (a, b) {
        return (a._id.localeCompare(b._id));
    });

    let cart = products;

    for (let i = 0; i < products.length; i++) {
        for (let k = 0; k < products.length; k++) {
            if (products[i]._id == cart[k]._id && i != k && cart[i].colors == cart[k].colors) {
                products[i].quantity += cart[k].quantity;
                products.splice(k, 1);
            }
        }
        localStorage.setItem("product", JSON.stringify(products));
    }
    alert(data.name + " " + data.colors + " ajouté au panier ! ")
}

/* On verifie que la couleur et la quantité sont correctes si oui on retourne vrai sinon faux */
function verifyCQ(color, quantity) {
    if (color == "" || quantity == 0) {
        return false
    }
    else return true
}