/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import AuthService from "@/services/api/auth.service";
import { logout } from "@/store/slices/auth";
import { UserState, CartState } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

export function Nav() {
  const user = useSelector((state: UserState) => state.auth.user)
  const cart = useSelector((state: { cart: CartState }) => state.cart);
  const dispatch = useDispatch()
  const router = useRouter()

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

  return (
    <nav className="bg-secondary">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-semibold text-primary">
              MINICART
            </Link>

          </div>
          <div>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 font-semibold">Hi, {user.name}!</span>
                
                <Link href="/cart" className="text-gray-600 hover:text-gray-900">
                  My Cart ({cart?.items?.length || 0})
                </Link>

                <Link href="/orders" className="text-gray-600 hover:text-gray-900">
                  My Orders
                </Link>

                <button
                  onClick={() => handleLogout()}
                  className="text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}