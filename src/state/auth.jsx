import React, {createContext, useContext, useState} from 'react'

const AuthContext = createContext(null)

export function AuthProvider({children}){
  const [user, setUser] = useState(null)

  const login = ({username, role}) => {
    let prefRole = role
    if(!prefRole){
      if(username?.toLowerCase() === 'akash') prefRole = 'seller'
      else if(username?.toLowerCase() === 'niraj') prefRole = 'buyer'
    }
    setUser({username, prefRole})
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{user, login, logout}}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
  return useContext(AuthContext)
}
