const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors());

app.listen(8080, () => {
  console.log("server is running");
});

mongoose
  .connect("mongodb://localhost:27017/bookStore")
  .then(() => {
    console.log("connected to mongoose");
  })
  .catch((err) => {
    console.log(err);
  });

const bookSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    isbn13: String,
    price: String,
    image: String,
    rating: String,
    url: String,
    discount: String,
  },
  { timestamps: true }
);

const booksModel = mongoose.model("books", bookSchema);
app.get("/", async (req, res) => {
  const data = await booksModel.find({});
  res.send({ data: data, success: true });
});

app.get("/:id", async (req, res) => {
  const data = await booksModel.find({ _id: req.params.id });
  res.send({ success: true, data: data });
});

app.post("/create", async (req, res) => {
  const data = new booksModel(req.body);
  await data.save();
  res.send({ success: true, message: "data save successfully" });
});

app.put("/update", async (req, res) => {
  const { _id, ...rest } = req.body;
  const data = await booksModel.updateOne({ _id: _id }, rest);
  res.send({ success: true, message: "data update successfully", data: data });
});
