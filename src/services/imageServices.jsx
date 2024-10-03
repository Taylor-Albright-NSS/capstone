export const getAllImages = async () => {
    const imagesResponse = await fetch(`http://localhost:8088/images`)
    const imagesData = await imagesResponse.json()
    return imagesData
}