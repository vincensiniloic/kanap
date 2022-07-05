let orderId = new URLSearchParams(document.location.search).get("commande");
if (orderId) {
  document.getElementById("orderId").innerHTML = orderId
}
else {
  document.querySelector('.confirmation').innerHTML = "Vous n'avez pas de commande..."
}