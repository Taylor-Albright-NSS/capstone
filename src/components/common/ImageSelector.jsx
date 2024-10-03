import { useEffect, useState } from "react"
import { getAllImages } from "../../services/imageServices"
import './ImageSelector.css'

export const ImageSelector = ({ itemData, setItemData }) => {
    const [images, setImages] = useState()
    useEffect(() => {
        getAllImages().then(allImages => {
            setImages(allImages)
            console.log(allImages)
        })
    }, [])

    const handleImageSelect = (image) => {
        console.log(image, 'image')
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
                    <div className='image' onClick={() => {handleImageSelect(image)}}>
                        <img src={image.imageURL} />
                    </div>
                )
            }) : ''}
        </div>
    )
}