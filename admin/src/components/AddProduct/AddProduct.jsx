import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../../assets/images/upload_area.svg";

const AddProduct = () => {
  const [uploadImage, setUploadImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    old_price: "",
    new_price: "",
    category: "women",
    image: "",
  });

  const imageHandler = (e) => {
    setUploadImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const Add_Product = async () => {
    let responseData;
    let product = productDetails;

    let formData = new FormData();
    formData.append("product", uploadImage);

    await fetch("http://localhost:4000/upload", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      product.image = responseData.image_url;

      console.log(product);

      await fetch("http://localhost:4000/addproduct", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })
        .then((res) => res.json())
        .then((data) =>
          data.status ? alert("Product added successfully!") : alert("Failed")
        );
    }
  };

  return (
    <div className="addproduct">
      <div className="addproduct-itemfield">
        <label htmlFor="name">Product title</label>
        <input
          type="text"
          value={productDetails.name}
          onChange={changeHandler}
          name="name"
          id="name"
          placeholder="Enter product name"
        />
      </div>

      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <label htmlFor="old_price">Price</label>
          <input
            type="text"
            value={productDetails.old_price}
            onChange={changeHandler}
            name="old_price"
            id="old_price"
            placeholder="Price"
          />
        </div>

        <div className="addproduct-itemfield">
          <label htmlFor="new_price">Offer price</label>
          <input
            type="text"
            value={productDetails.new_price}
            onChange={changeHandler}
            name="new_price"
            id="new_price"
            placeholder="Offer price"
          />
        </div>
      </div>

      <div className="addproduct-itemfield">
        <label htmlFor="category">Product category: </label>
        <select
          id="category"
          name="category"
          value={productDetails.category}
          onChange={changeHandler}
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>

      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={uploadImage ? URL.createObjectURL(uploadImage) : upload_area}
            alt=""
          />
        </label>
        <input onChange={imageHandler} type="file" id="file-input" hidden />
      </div>

      <button onClick={() => Add_Product()} className="addproduct-btn">
        Add Product
      </button>
    </div>
  );
};

export default AddProduct;
