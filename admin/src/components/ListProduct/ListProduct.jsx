import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from "../../assets/images/cross_icon.png";

const ListProduct = () => {
  const [products, setProducts] = useState([]);

  const fetchAll = async () => {
    await fetch("http://localhost:4000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.data.products));
  };
  // console.log(allproducts.data.products);

  useEffect(() => {
    fetchAll();
  }, []);

  const removeProduct = async (id) => {
    await fetch("http://localhost:4000/deleteproduct", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });

    await fetchAll();
  };

  return (
    <div className="listproduct">
      <h4>List of products</h4>
      <table className="table table-striped table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Product title</th>
            <th>Category</th>
            <th>Price</th>
            <th>Offer price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            return (
              <tr key={product._id}>
                <td>{product.id}</td>
                <td>
                  <img src={product.image} alt="" style={{ width: 40 }} />
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>${product.new_price}</td>
                <td>${product.old_price}</td>
                <td>
                  <img
                    src={cross_icon}
                    alt=""
                    onClick={() => removeProduct(product.id)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ListProduct;
