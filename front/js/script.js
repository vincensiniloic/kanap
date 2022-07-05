//On récupère les données de l'API grâce à fetch.
fetch("http://localhost:3000/api/products")
    // On met le résultat en json.
    .then((res) => res.json())
    // ce que l'on a reçu et qui a été transformé en json sera appelé data
    .then((data) => {
        printData(data, "#items")
    })
    // dans le cas d'une erreur remplace le contenu de titre par un h1 au contenu de erreur 404 et renvoit en console l'erreur.
    .catch((err) => {
        document.querySelector(".titles").innerHTML = "<h1>erreur 404</h1>";
        console.log("erreur 404, sur ressource api:" + err);
    });

/* Affiche tous les produits récuperés grâce à l'API */
function printData(data, target) {

    for (let article of data) {
        document.querySelector(target).innerHTML += `<a href="./product.html?_id=${article._id}">
        <article>
          <img src="${article.imageUrl}" alt="${article.altTxt}">
          <h3 class="productName">${article.name}</h3>
          <p class="productDescription">${article.description}</p>
        </article>
      </a>`;
    }
}

