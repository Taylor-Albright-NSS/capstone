export const getUserByEmailAndPassword = (userName, password) => {
    return fetch(`http://localhost:8088/users?userName=${userName}&password=${password}`).then((res) =>
      res.json()
    )
  }
  export const getUserByEmail = (email) => {
    return fetch(`http://localhost:8088/users?email=${email}`).then((res) =>
      res.json()
    )
  }
  export const getUserById = async (userId) => {
    const userResponse = await fetch(`http://localhost:8088/users?id=${userId}`)
    const userData = await userResponse.json()
    return userData
  }
  
  export const createUser = (user) => {
    return fetch("http://localhost:8088/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }).then((res) => res.json())
  }