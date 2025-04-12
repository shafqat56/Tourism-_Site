// Fetch travel recommendations from JSON
async function fetchTravelRecommendations() {
  try {
    const response = await fetch("travel_recommendation_api.json");
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json();
    console.log("Data loaded:", data);
    return data;
  } catch (error) {
    console.error("Error:", error);
    alert("Error loading travel data. Please try again later.");
    return null;
  }
}

// Display recommendations on the page
function displayRecommendations(recommendations) {
  const container = document.getElementById("recommendations");
  container.innerHTML = ""; 

  if (!recommendations || recommendations.length === 0) {
    container.innerHTML =
      '<p class="no-results">No results found. Try a different search term.</p>';
    return;
  }

  recommendations.forEach((item) => {
    const card = document.createElement("div");
    card.className = "recommendation-card";
    card.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Image+Not+Available'">
      <div class="recommendation-content">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <button class="visit-btn">Visit</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Handle search functionality
async function searchRecommendations() {
  const keyword = document
    .getElementById("search-input")
    .value.trim()
    .toLowerCase();
  if (!keyword) {
    alert("Please enter a search term (beach, temple, or country name)");
    return;
  }

  const data = await fetchTravelRecommendations();
  if (!data) return;

  let results = [];

  // Check for keyword matches
  if (keyword.includes("beach")) {
    results = [...data.beaches];
  } else if (keyword.includes("temple")) {
    results = [...data.temples];
  } else {
    // Search countries and their cities
    data.countries.forEach((country) => {
      if (country.name.toLowerCase().includes(keyword)) {
        results = [...results, ...country.cities];
      }
      // Also check individual city names
      country.cities.forEach((city) => {
        if (city.name.toLowerCase().includes(keyword)) {
          results.push(city);
        }
      });
    });
  }

  console.log("Search results:", results);
  displayRecommendations(results);
}

// Clear results and search input
function clearResults() {
  document.getElementById("search-input").value = "";
  document.getElementById("recommendations").innerHTML = "";
  console.log("Results cleared");
}

// Initialize event listeners
document.addEventListener("DOMContentLoaded", function () {
  // Search button
  document
    .querySelector(".search-btn")
    .addEventListener("click", searchRecommendations);

  // Clear button
  document.querySelector(".reset-btn").addEventListener("click", clearResults);

  // Search on Enter key
  document
    .getElementById("search-input")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") searchRecommendations();
    });

  // Visit button event delegation
  document
    .getElementById("recommendations")
    .addEventListener("click", function (e) {
      if (e.target.classList.contains("visit-btn")) {
        const card = e.target.closest(".recommendation-card");
        const destination = card.querySelector("h3").textContent;
        alert(`You clicked to visit ${destination}!`);
      }
    });
});
