"use client"

import { getStorageItem, setStorageItem } from "@/lib/auth"

export const getCoins = () => {
    return Number(getStorageItem("balance", 0))
}

export const spendCoin = () =>{
    const balance = getCoins()

    if (balance <= 0) {
        return false
    }

    const newBalance = balance - 1

    setStorageItem("balance", newBalance || 0) 

    return true

}