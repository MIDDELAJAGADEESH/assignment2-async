let main = document.querySelector(".main");
let click = document.querySelector(".click");

function delay() {
    return new Promise(resolve => setTimeout(resolve, 5000));
}

function fetchWithTimeout(url, timeout = 5000) {
    return Promise.race([
        fetch(url),
        new Promise((reject) =>
            setTimeout(() => reject(new Error("Request timed out")), timeout)
        ),
    ]);
}

async function fetchData() {
    try {
        let result = await fetchWithTimeout("https://dummyjson.com/posts");
        let data = await result.json();
        if (!result.ok) {
            throw new Error("Network response was not ok");
        }
        return data.posts.map(post => post.title);
    } catch (error) {
        throw error;
    }
}

click.addEventListener("click", async function () {
    const newSection = document.createElement("section");
    const bmsg = document.createElement("p");
    bmsg.className = "bmsg";
    newSection.className = "dissection";
    newSection.appendChild(bmsg);
    main.appendChild(newSection);
    bmsg.innerHTML = "Loading";
    const dis = document.createElement("ul");
    bmsg.appendChild(dis);

    await delay();

    try {
        let titles = await fetchData();
        if (titles) {
            const change = document.createElement("div");
            change.className = "display";
            titles.forEach(title => {
                let li = document.createElement("li");
                li.innerHTML = title;
                change.appendChild(li);
            });
            bmsg.replaceWith(change);
        } else {
            bmsg.innerHTML = "No titles found.";
        }
    } catch (error) {
        bmsg.innerHTML = `Error: ${error.message}`;
    }
});
