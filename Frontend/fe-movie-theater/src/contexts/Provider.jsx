import React, { createContext, useEffect, useState } from 'react'

export const context = createContext();

function Provider({children}) {

  const [data,setData] = useState();

  useEffect(() => {

  },[]);

  let value = {

  };

  return (
    <context.Provider value={value}>
      {children}
    </context.Provider>
  )
}

export default Provider
