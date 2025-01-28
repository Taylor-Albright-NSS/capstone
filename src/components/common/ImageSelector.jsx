import { useEffect, useState } from "react"
import { getAllImages } from "../../services/imageServices"
import './ImageSelector.css'

export const ImageSelector = ({ itemData, setItemData }) => {
    console.log(itemData)
    const [images, setImages] = useState()
    useEffect(() => {
        getAllImages().then(allImages => {
            setImages(allImages)
            console.log(allImages)
        })
    }, [])

    const handleImageSelect = (event, image) => {
        const selectedImages = document.querySelectorAll('.image')
        selectedImages.forEach(imageElement => {
            imageElement.classList.remove('selected')
        })
        console.log(event)
        event.target.classList.add('selected')
        setItemData({...itemData,
            imageId: image.id,
             image: {
                id: image.id,
                imageURL: image.imageURL,
             }
            })
    }

    return (
        <div className='images-main'>
            {images ? images.map(image => {
                return (
                    <img 
                    onClick={(event) => {handleImageSelect(event, image)}} 
                    key={image.key} 
                    className='image' 
                    src={`/${image.imageURL}`} />
                )
            }) : ''}
        </div>
    )
}