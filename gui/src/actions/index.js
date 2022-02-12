import { SERVER } from '../config/global'


//pentru Spacecraft
export const getSpacecrafts = (filterString, page, pageSize, sortField, sortOrder) => {
  return {
    type: 'GET_SPACECRAFTS',
    payload: async () => {
      const response = await fetch(`${SERVER}/spacecrafts?${filterString}&sortField=${sortField || ''}&sortOrder=${sortOrder || ''}&page=${page || ''}&pageSize=${pageSize || ''}`)
      const data = await response.json()
      return data
    }
  }
}

export const addSpacecraft = (spacecraft, filterString, page, pageSize, sortField, sortOrder) => {
  return {
    type: 'ADD_SPACECRAFT',
    payload: async () => {
      let response = await fetch(`${SERVER}/spacecrafts`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(spacecraft)
      })
      response = await fetch(`${SERVER}/spacecrafts?${filterString}&sortField=${sortField || ''}&sortOrder=${sortOrder || ''}&page=${page || ''}&pageSize=${pageSize || ''}`)
      const data = await response.json()
      return data
    }
  }
}

export const saveSpacecraft = (id, spacecraft, filterString, page, pageSize, sortField, sortOrder) => {
  return {
    type: 'SAVE_SPACECRAFT',
    payload: async () => {
      let response = await fetch(`${SERVER}/spacecrafts/${id}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(spacecraft)
      })
      response = await fetch(`${SERVER}/spacecrafts?${filterString}&sortField=${sortField || ''}&sortOrder=${sortOrder || ''}&page=${page || ''}&pageSize=${pageSize || ''}`)
      const data = await response.json()
      return data
    }
  }
}

export const deleteSpacecraft = (id, filterString, page, pageSize, sortField, sortOrder) => {
  return {
    type: 'DELETE_SPACECRAFT',
    payload: async () => {
      let response = await fetch(`${SERVER}/spacecrafts/${id}`, {
        method: 'delete'
      })
      response = await fetch(`${SERVER}/spacecrafts?${filterString}&sortField=${sortField || ''}&sortOrder=${sortOrder || ''}&page=${page || ''}&pageSize=${pageSize || ''}`)
      const data = await response.json()
      return data
    }
  }
}

//pentru astronauts
export const getAstronauts = (spacecraftId) => {
    return {
      type: 'GET_ASTRONAUTS',
      payload: async () => {
        const response = await fetch(`${SERVER}/spacecrafts/${spacecraftId}/astronauts`)
        const data = await response.json()
        return data
      }
    }
  }
  
  export const addAstronaut = (spacecraftId, astronaut) => {
    return {
      type: 'ADD_ASTRONAUT',
      payload: async () => {
        let response = await fetch(`${SERVER}/spacecrafts/${spacecraftId}/astronauts`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(astronaut)
        })
        response = await fetch(`${SERVER}/spacecrafts/${spacecraftId}/astronauts`)
        const data = await response.json()
        return data
      }
    }
  }
  
  export const saveAstronaut = ( spacecraftId, astronaut, astroId) => {
    return {
      type: 'SAVE_ASTRONAUT',
      payload: async () => {
        let response = await fetch(`${SERVER}/spacecrafts/${spacecraftId}/astronauts/${astroId}`, {
          method: 'put',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(astronaut)
        })
        response = await fetch(`${SERVER}/spacecrafts/${spacecraftId}/astronauts/${astroId}`)
        const data = await response.json()
        return data
      }
    }
  }
  
  export const deleteAstronaut = (spacecraftId, astroId) => {
    return {
      type: 'DELETE_SPACECRAFT',
      payload: async () => {
        let response = await fetch(`${SERVER}/spacecrafts/${spacecraftId}/astronauts/${astroId}`, {
          method: 'delete'
        })
        response = await fetch(`${SERVER}/spacecrafts/${spacecraftId}/astronauts/${astroId}`)
        const data = await response.json()
        return data
      }
    }
  }