/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import AuthService from "@/services/api/auth.service";
import StorageService from "@/services/app/storage.service";
import { logout, setUser } from "@/store/slices/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCart } from "@/store/slices/cartSlice";
import CartService from "@/services/api/cart.service";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const fetchUserDetails = async () => {
    try {
      if (StorageService.get('user')) {
        AuthService.getUserDetails()
          .then(async data => {
            if (data.data) {
              dispatch(setUser(data.data));
              // Fetch cart data after successful auth
              try {
                const cartResponse = await CartService.getCart();
                dispatch(setCart(cartResponse.data));
              } catch (error) {
                console.log('Failed to fetch cart:', error);
              }
            } else {
              handleLogout();
            }
          })
          .catch(error => {
            console.log(error);
            handleLogout();
          })
      } else {
        handleLogout();
      }
    } catch (error) {
      console.log(error);
      handleLogout();
    }
  };

  const handleLogout = async () => {
    try {
      AuthService.logout()
        .then(data => {
          dispatch(logout())
          router.push('/')
        })
        .catch(error => {
          console.log(error);
        })
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>{children}</div>
  )
}
