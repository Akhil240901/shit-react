import images from "../data/images.json"
import "../style/Carousel.css"
import { useEffect, useRef, useState } from "react"

const LENGTH = images.length;
export const Carousel = () => {
    const [index, setIndex] = useState(0)
    const ref = useRef(null);
    const handlePrev = () => {
        if (index === 0) {
            setIndex(LENGTH - 1)
        }

        setIndex((prev) => prev - 1);
    }

    const handleNext = () => {
        if (index === LENGTH - 1) {
            setIndex(0);
        }

        setIndex((prev) => prev + 1);
    }

    //handle auto scroll 
    useEffect(() => {
        ref.current = setInterval(() => {
            setIndex((prev) => (prev === LENGTH - 1 ? 0 : prev + 1))
        }, 1000)

        return () => clearInterval(ref.current);
    }, [])
    return <>
        <div className="container" onMouseEnter={() => clearInterval(ref.current)} onMouseLeave={() => {
            ref.current = setInterval(() => {
                setIndex((prev) => (prev === LENGTH - 1 ? 0 : prev + 1))
            }, 1000)

            return () => clearInterval(ref.current);
        }}>
            <div className="left-btn" onClick={handlePrev}>{"<"}</div>
            <img alt="" src={images[index].download_url} />

            <div className="right-btn" onClick={handleNext}>{">"}</div>
        </div>
    </>
}