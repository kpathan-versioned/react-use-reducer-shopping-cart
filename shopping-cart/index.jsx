import { useEffect, useReducer, useState } from "react";

const products = [
  { id: 1, name: "Headphones", price: 2000 },
  { id: 2, name: "Smart Watch", price: 3000 },
  { id: 3, name: "Keyboard", price: 1500 },
];

const initialState = {
  items: [],
  couponApplied: false,
};

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }
    case "INCREMENT":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      };

    case "DECREMENT":
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.id === action.payload
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          )
          .filter((item) => item.quantity > 0),
      };
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case "APPLY_COUPON": {
      if (state.items.length === 0) return state;
      return {
        ...state,
        couponApplied: true,
      };
    }
    case "REMOVE_COUPON": {
      return { ...state, couponApplied: false };
    }
    case "CLEAR_CART": {
      return initialState;
    }
  }
}

export default function ShoppingCart() {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const subtotal = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const discount = state.couponApplied ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  return (
    <div style={{ padding: 20 }}>
      <h2>Shopping Cart</h2>
      <h3>Available Products</h3>
      {products.map((product) => (
        <div key={product.id} style={{ marginBottom: 10 }}>
          {product.name} -₹{product.price}
          <button
            onClick={() => dispatch({ type: "ADD_ITEM", payload: product })}
          >
            Add to Cart
          </button>
        </div>
      ))}
      <hr />
      <h3>Your Cart</h3>
      {state.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        state.items.map((item) => (
          <div key={item.di} style={{ marginBottom: 15 }}>
            <strong>{item.name}</strong>
            {" | Quantity: "}
            {item.quantity}
            <button
              onClick={() => dispatch({ type: "INCREMENT", payload: item.id })}
            >
              +
            </button>
            <button
              onClick={() => dispatch({ type: "DECREMENT", payload: item.id })}
            >
              -
            </button>

            <button
              onClick={() =>
                dispatch({ type: "REMOVE_ITEM", payload: item.id })
              }
            >
              Reomve
            </button>
          </div>
        ))
      )}
      <hr />
      <p>Subtotal: ₹{subtotal}</p>

      <p>Discount: ₹{discount}</p>

      <h3>Total: ₹{total}</h3>
      <button
        onClick={() => dispatch({ type: "APPLY_COUPON" })}
        disabled={state.items.length === 0 || state.couponApplied}
      >
        Apply 10% Coupon
      </button>
      <button
        onClick={() => dispatch({ type: "REMOVE_COUPON" })}
        disabled={!state.couponApplied}
      >
        Remove Coupon
      </button>

      <button
        onClick={() => dispatch({ type: "CLEAR_CART" })}
        disabled={state.items.length === 0}
      >
        Clear Cart
      </button>
    </div>
  );
}
