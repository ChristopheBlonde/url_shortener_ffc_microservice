const fetchData = () => {
  fetch(`${window.location.href}shorturl`, {
    method: "GET",
    mode: "cors",
    headers: new Headers(),
    cache: "default",
  })
    .then((response) =>
      response
        .json()
        .then((data) => {
          /* use data list url */
          const list = document.getElementById("list");
          data.forEach((elem, index) => {
            const isPresent = document.getElementById(elem._id);
            if (isPresent) return;
            const tr = document.createElement("tr");
            const td1 = document.createElement("td");
            const td2 = document.createElement("td");
            const td3 = document.createElement("td");
            const icon = document.createElement("img");

            tr.setAttribute("id", `${elem._id}`);
            tr.setAttribute("class", "item");
            td1.innerText = elem.original_url;
            tr.appendChild(td1);
            td2.innerText = elem.short_url;
            tr.appendChild(td2);
            icon.setAttribute("src", `../assets/images/icons8-effacer.svg`);
            icon.setAttribute("class", "icon-trash");
            icon.setAttribute("ref", `${elem.short_url}`);
            icon.addEventListener("click", (event) => {
              deleteItem(event.target.getAttribute("ref"));
            });
            td3.setAttribute("class", "icon");
            td3.appendChild(icon);
            tr.appendChild(td3);
            list.appendChild(tr);
          });
        })
        .catch((err) => console.log(err))
    )
    .catch((err) => console.log(err));
};

const deleteItem = (shorturl) => {
  fetch(`${window.location.href}api/shorturl/${shorturl}`, {
    method: "DELETE",
    headers: new Headers(),
    mode: "cors",
    cache: "default",
  })
    .then((response) =>
      response
        .json()
        .then((data) => {
          document.getElementById(`${data._id}`).remove();
        })
        .catch((err) => console.log(err))
    )
    .catch((err) => console.log(err));
};

document.onload = fetchData();
document.addEventListener("DOMContentLoaded", () => {
  console.log("Document was loaded");

  document.getElementById("url-submit").addEventListener("click", () => {
    const input = document.getElementById("url-input");
    fetch(`${window.location.href}api/shorturl`, {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      mode: "cors",
      cache: "default",
      body: JSON.stringify({ url: input.value }),
    })
      .then((body) =>
        body
          .json()
          .then(() => fetchData())
          .catch((err) => console.log(err))
      )
      .catch((err) => console.log(err));
    input.value = "";
  });

  document.getElementById("short-submit").addEventListener("click", () => {
    const shortInput = document.getElementById("short-input");
    const short_url = shortInput.value;
    window.location.href = `${window.location.href}api/shorturl/${short_url}`;
  });
});
