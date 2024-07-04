import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;


// prettier se error in index.ejs

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "Shivam@123",
  port: 5432,
}); 
db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM toDoList ORDER BY id ASC");
    items = result.rows;
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
    // console.log(items);
  } catch (err) {
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  const new_item = req.body.newItem;
  const id = 3;
  const result = await db.query(
    "INSERT INTO todolist (id,title) VALUES ($1,$2)",
    [id, new_item]
  );
  // const item = req.body.newItem;
  items.push(new_item);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const edit_item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;

  try {
    await db.query("UPDATE todolist SET title = ($1) where id = $2", [
      edit_item,
      id,
    ]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async(req, res) => {
  const delete_item_id = req.body.deleteItemId;

  console.log(delete_item_id);
  try {
    await db.query("DELETE FROM todolist where id = $1", [delete_item_id]);
    res.redirect("/")
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
