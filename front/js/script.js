//On récupère les données de l'API grâce à fetch.
fetch("http://localhost:3000/api/products")
    // On met le résultat en json.
    .then((res) => res.json())
    // ce que l'on a reçu et qui a été transformé en json sera appelé data
    .then((data) => {
        printData(data)
    })
    // dans le cas d'une erreur remplace le contenu de titre par un h1 au contenu de erreur 404 et renvoit en console l'erreur.
    .catch((err) => {
        document.querySelector(".titles").innerHTML = "<h1>erreur 404</h1>";
        console.log("erreur 404, sur ressource api:" + err);
    });

/* Affiche tous les produits récuperés grâce à l'API */
function printData(data) {

    for (let item of data) {

        let lien = document.createElement('a');
        let article = document.createElement('article');
        let img = document.createElement('img');
        let h3 = document.createElement('h3');
        let p = document.createElement('p');

        lien.setAttribute("href", `./product.html?id=${item._id}`);

        img.setAttribute("src", `${item.imageUrl}`);
        img.setAttribute("alt", `${item.altTxt}`);

        h3.setAttribute("class", `productName`);
        h3.innerText = `${item.name}`

        p.setAttribute("class", `productDescription`);
        p.innerText = `${item.description}`

        article.appendChild(img)
        article.appendChild(h3)
        article.appendChild(p)

        lien.appendChild(article)

        document.getElementById('items').appendChild(lien);
    }
}

