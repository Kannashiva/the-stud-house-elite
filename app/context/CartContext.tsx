"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { supabase } from "../../lib/supabase";

export type CartProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
};

export type CartItem = CartProduct & {
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (
    product: CartProduct,
    quantity?: number
  ) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
};

const CartContext =
  createContext<CartContextType | undefined>(
    undefined
  );

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load saved cart and refresh latest product details
  useEffect(() => {
    const loadCart = async () => {
      const savedCart = localStorage.getItem(
        "stud-house-cart"
      );

      if (!savedCart) {
        setLoaded(true);
        return;
      }

      try {
        const parsedCart = JSON.parse(
          savedCart
        ) as CartItem[];

        if (parsedCart.length === 0) {
          setCart([]);
          setLoaded(true);
          return;
        }

        const productIds = parsedCart.map(
          (item) => Number(item.id)
        );

        const {
          data: latestProducts,
          error,
        } = await supabase
          .from("products")
          .select(
            `
            id,
            name,
            price,
            image_url,
            category,
            stock,
            reserved_stock,
            is_active
            `
          )
          .in("id", productIds)
          .eq("is_active", true);

        if (error) {
          console.error(
            "Unable to refresh cart products:",
            error
          );

          setCart(parsedCart);
          setLoaded(true);
          return;
        }

        const refreshedCart: CartItem[] =
          parsedCart
            .map((cartItem) => {
              const latestProduct =
                latestProducts?.find(
                  (product) =>
                    Number(product.id) ===
                    Number(cartItem.id)
                );

              if (!latestProduct) {
                return null;
              }

              const totalStock = Number(
                latestProduct.stock || 0
              );

              const reservedStock = Number(
                latestProduct.reserved_stock || 0
              );

              const availableStock = Math.max(
                0,
                totalStock - reservedStock
              );

              // Remove product if no stock is currently available
              if (availableStock <= 0) {
                return null;
              }

              return {
                id: String(
                  latestProduct.id
                ),

                name:
                  latestProduct.name,

                price: Number(
                  latestProduct.price
                ),

                image:
                  latestProduct.image_url,

                category:
                  latestProduct.category,

                // Important:
                // Store AVAILABLE stock
                stock: availableStock,

                quantity: Math.min(
                  cartItem.quantity,
                  availableStock
                ),
              };
            })
            .filter(
              (
                item
              ): item is CartItem =>
                item !== null
            );

        setCart(refreshedCart);
      } catch (error) {
        console.error(
          "Cart loading error:",
          error
        );

        localStorage.removeItem(
          "stud-house-cart"
        );

        setCart([]);
      }

      setLoaded(true);
    };

    loadCart();
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(
        "stud-house-cart",
        JSON.stringify(cart)
      );
    }
  }, [cart, loaded]);

  const addToCart = (
    product: CartProduct,
    quantity = 1
  ) => {
    const availableStock = Number(
      product.stock
    );

    if (
      !Number.isFinite(availableStock) ||
      availableStock <= 0
    ) {
      return;
    }

    const safeQuantity = Math.min(
      Math.max(1, quantity),
      availableStock
    );

    setCart((currentCart) => {
      const existingProduct =
        currentCart.find(
          (item) =>
            item.id === product.id
        );

      if (existingProduct) {
        return currentCart.map((item) => {
          if (
            item.id !== product.id
          ) {
            return item;
          }

          return {
            ...item,
            ...product,

            quantity: Math.min(
              item.quantity +
                safeQuantity,
              availableStock
            ),
          };
        });
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: safeQuantity,
        },
      ];
    });
  };

  const removeFromCart = (
    id: string
  ) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== id
      )
    );
  };

  const increaseQuantity = (
    id: string
  ) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const availableStock =
          Number(item.stock);

        if (
          !Number.isFinite(
            availableStock
          ) ||
          availableStock <= 0 ||
          item.quantity >=
            availableStock
        ) {
          return item;
        }

        return {
          ...item,
          quantity:
            item.quantity + 1,
        };
      })
    );
  };

  const decreaseQuantity = (
    id: string
  ) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      item.price *
        item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}