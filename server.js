// Name: Alexie T. Maglalang
// WD-303 - 2190-6WCSERVER

const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;
const publicPath = path.join(__dirname, "public");
const pagesPath = path.join(publicPath, "pages");

app.use(express.static(publicPath));

function renderPage(pageName) {
  return (req, res) => {
    console.log(`Rendering ${pageName}`);
    res.sendFile(path.join(pagesPath, pageName));
  };
}

app.get("/", renderPage("index.html"));
app.get("/menu", renderPage("menu.html"));
app.get("/about", renderPage("about.html"));
app.get("/contact", renderPage("contact.html"));

app.get("/api/menu", (req, res) => {
  const menuPath = path.join(__dirname, "data", "menu.json");
  const menu = require(menuPath);
  const category = req.query.category;

  if (category && category !== "All") {
    return res.json(
      menu.filter(
        (item) =>
          item.category.toLowerCase() === category.toLowerCase()
      )
    );
  }

  res.json(menu);
});

app.get("/api/menu/:id", (req, res) => {
  const menuPath = path.join(__dirname, "data", "menu.json");
  const menu = require(menuPath);
  const item = menu.find(
    (entry) => String(entry.id) === req.params.id
  );

  if (!item) {
    return res.status(404).json({ message: "Menu item not found" });
  }

  res.json(item);
});

// Render the 404 page for unknown routes.
app.use((req, res) => {
  console.log("Rendering 404.html");
  res.status(404).sendFile(path.join(pagesPath, "404.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port 3000`);
});