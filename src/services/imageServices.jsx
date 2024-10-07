export const getAllImages = async () => {
    const imagesResponse = await fetch(`http://localhost:8088/images`)
    const imagesData = await imagesResponse.json()
    const images = imagesData.filter(image => image.id != 0)
    return images
}