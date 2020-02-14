//fetch("http://kea-alt-del.dk/t5/api/categories")
//    .then(function (response) {
//        return response.json();
//    })
//    .then(function (data) {
//        setSections(data);
//    });
//

getSections();
window.setTimeout(getCourses(), 100);

function setSections(jsonData) {
    jsonData.forEach(createSections);
}

function setSectionButtons(jsonData) {
    jsonData.forEach(createSectionButtons);
}

function setCourses(jsonData) {
    console.log(jsonData);
    jsonData.forEach(addCourses);
    console.warn(`[INFO] ADDED ${jsonData.length} COURSES`)
}

function getCourses() {
    fetch("http://kea-alt-del.dk/t5/api/productlist")
        .then(function (response) {
            return response.json();
        }).
    then(function (data) {
        setCourses(data);
    });
}

function getSections() {
    fetch("http://kea-alt-del.dk/t5/api/categories")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            setSections(data);
            setSectionButtons(data);
        });
}


function addCourses(course) {
    const courseTemplate = document.querySelector("#foodTemplate").content;
    const courseClone = courseTemplate.cloneNode(true);
    const imagePath = "https://kea-alt-del.dk/t5/site/imgs/";

    courseClone.querySelector("h2").textContent = course.name;
    if (course.discount) {
        courseClone.querySelector(".discount").textContent = course.price;
        courseClone.querySelector(".price").textContent = Math.round(course.price - (course.price * course.discount / 100));
    } else {
        courseClone.querySelector(".price").textContent = course.price;
    }

    if (course.vegetarian) {
        courseClone.querySelector(".modImgVeg").src = "imgs/veg.png";
        courseClone.querySelector(".modImgVeg").style.display = "block";
    }
    if (course.alcohol) {
        courseClone.querySelector(".modImgAlc").src = "imgs/alcohol.png";
        courseClone.querySelector(".modImgAlc").style.display = "block";
    }
    if (course.soldout) {
        courseClone.querySelector(".soldOut").src = "imgs/soldout.png";
        courseClone.querySelector(".soldOut").style.display = "inline-block";
        courseClone.querySelector(".soldOut").style.disabled = true;
        courseClone.querySelector("button").style.backgroundColor = "#c96747";
        courseClone.querySelector(".foodItem").style.backgroundColor = "#ffb2b2";
        courseClone.querySelector("button").textContent = "Sold out";
    } else {
        courseClone.querySelector("button").addEventListener("click", function () {
            fetch(`http://kea-alt-del.dk/t5/api/product?id=${course.id}`)
                .then(function (response) {
                    return response.json();
                }).
            then(function (data) {
                displayModal(data);
            });
        });
    }
    courseClone.querySelector(".foodItem img").src = imagePath + "small/" + course.image + "-sm.jpg";
    courseClone.querySelector(".desc").textContent = course.shortdescription;

    if (document.querySelector(`#${course.category}`) != null) {
        document.querySelector(`#${course.category}`).appendChild(courseClone);
    }
}

function displayModal(course) {
    console.log("[INFO] DISPLAYING MODAL " + course.name);
    const modal = document.querySelector(".foodModal");
    modal.style.display = "block";

    const imagePath = "https://kea-alt-del.dk/t5/site/imgs/";

    var span = document.querySelector(".close");
    document.querySelector(".foodModal p").textContent = course.name;
    document.querySelector(".foodModal .modalDescription").textContent = course.longdescription;
    document.querySelector(".foodModal .modalFoodImg").src = imagePath + "medium/" + course.image + "-md.jpg";

    if(course.discount){
        document.querySelector(".foodModal .modalPrice .modalDiscount").textContent = course.price;
        document.querySelector(".foodModal .modalPrice .modalActualPrice").textContent = Math.round(course.price - (course.price * course.discount / 100));
    } else {
        document.querySelector(".foodModal .modalPrice .modalDiscount").style.display = "none";
        document.querySelector(".foodModal .modalPrice .modalActualPrice").textContent = course.price;
    }

    if (course.vegetarian) {
        document.querySelector(".foodModal .modalDescriptionImgs .modImgVeg").src = "imgs/veg.png";
        document.querySelector(".foodModal .modalDescriptionImgs .modImgVeg").style.display = "block";
        document.querySelector(".foodModal .modalDescriptionImgs .modImgVegP").style.display = "block";
    } else {
        document.querySelector(".foodModal .modalDescriptionImgs .modImgVeg").style.display = "none";
        document.querySelector(".foodModal .modalDescriptionImgs .modImgVegP").style.display = "none";
    }
    if (course.alcohol != 0 ) {
        document.querySelector(".foodModal .modalDescriptionImgs .modImgAlc").src = "imgs/alcohol.png";
        document.querySelector(".foodModal .modalDescriptionImgs .modImgAlc").style.display = "block";
        document.querySelector(".foodModal .modalDescriptionImgs .modImgAlcP").style.display = "block";
        document.querySelector(".foodModal .modalDescriptionImgs .modImgAlcP span").textContent = course.alcohol;
    } else {
        document.querySelector(".foodModal .modalDescriptionImgs .modImgAlc").style.display = "none";
        document.querySelector(".foodModal .modalDescriptionImgs .modImgAlcP").style.display = "none";
    }


    span.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function createSections(category) {
    const mainBody = document.querySelector("main");
    if (document.querySelector(`#${category}`) == null) {
        console.warn("[INFO] ADDED SECTION " + category);
        const createdSection = document.createElement("section");
        const createdh2 = document.createElement("h2");

        createdSection.setAttribute("id", `${category}`);
        createdh2.setAttribute("class", `sectionTitle`);
        createdh2.textContent = `${category}`.toUpperCase();

        mainBody.appendChild(createdSection);
        createdSection.appendChild(createdh2);
    }
}

function createSectionButtons(category) {
    const btnSection = document.querySelector(".btnSection");
    if (document.querySelector(`#${category}Btn`) == null) {
        console.warn("[INFO] ADDED BUTTON " + category);

        const createdButton = document.createElement("button");
        createdButton.setAttribute("class", `${category}Btn`);
        createdButton.textContent = `${category}`.toUpperCase();


        createdButton.setAttribute("href", `#${category}`);
        btnSection.appendChild(createdButton);
    }
}
