import { createContext, useContext, useState, useEffect } from "react";
import { fetchAdsSettings } from "./db";

const AdsCtx = createContext({ ads: { global: false, states: {} }, setAds: () => {} });

export const useAds = () => useContext(AdsCtx);

export function AdsProvider({ children }) {
  const [ads, setAds] = useState({ global: false, states: {} });
  useEffect(() => { fetchAdsSettings().then(setAds); }, []);
  return <AdsCtx.Provider value={{ ads, setAds }}>{children}</AdsCtx.Provider>;
}
