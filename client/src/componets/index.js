import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import Movies from "./Movie/Movie";
import Modal from "react-modal";
import Button from "@material-ui/core/Button";
import PublishIcon from "@material-ui/icons/Publish";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

Modal.setAppElement("#root");


function Main() {
    const [isOpen, setIsOpen] = useState(false);
    const [picture, setPicture] = useState(null);
    const [imgData, setImgData] = useState(null);
    const [source, setSource] = React.useState();
    const [vid, setVid] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [video, setVideo] = useState([]);
    const [inputs, setInputs] = useState('');

    const inputRef = React.useRef();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const url = URL.createObjectURL(file);
        setSource(url);
        setVid(event.target.files[0])
    };

    const handleChange = e => setInputs(prevState => ({ ...prevState, [e.target.name]: e.target.value }));


    const onChangePicture = e => {
        if (e.target.files[0].type && e.target.files[0].type.indexOf('image') === -1) {
            console.log('File is not an image.');
            return;
        }
        if (e.target.files[0]) {
            console.log("picture: ", e.target.files[0]);

            setPicture(e.target.files[0]);
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setImgData(reader.result);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    function toggleModal() {
        setIsOpen(!isOpen);
        setImgData(null);
        setSource(null);
    }

    const addMovie = () => {
        const formData = new FormData();
        formData.append('title', inputs.title)
        formData.append('description', inputs.description)
        formData.append('director', inputs.director)
        formData.append('movie', vid)
        formData.append('date', startDate)
        formData.append('cover_image', picture)
        console.log(formData)
        const url = `http://localhost:4000/api/v1/upload-movie`
        axios.post(url, formData).then((response) => {
            setVideo([response.data.data, ...video])
        }).catch((err) => {
            console.log(err)
        })
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        fetch(`http://localhost:4000/api/v1/get-all-movies`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then(response => {
                if (response.error) {
                    throw response.error;
                }
                setVideo(response.data)
            })
            .catch((error) => {
            })


    }, [])

    const getAllVideo = video.map((info) => {
            return (
                <Movies data={info} onDelete={setVideo} allData={video} />
            )
        });

    return (
        <div className={styles.main}>
            <button onClick={toggleModal} className={styles.openmodal}>Add New Movie</button>
            {getAllVideo}
            <Modal
                isOpen={isOpen}
                onRequestClose={toggleModal}
                contentLabel="My dialog"
                className="mymodal"
                overlayClassName="myoverlay"
                closeTimeoutMS={200}
            >
                <div className={styles.cross}
                     onClick={toggleModal}
                >
                    x
                </div>
                <h2>Add New Movie</h2>

                <div className="vid">
                    <div className={styles.video_upl}>
                        <input
                            style={{ display: "none" }}
                            id="raised-button-video"
                            type="file"
                            onChange={handleFileChange}
                            accept=".mov,.mp4"
                        />
                        <Button
                            htmlFor="raised-button-video"
                            className="shapefile-icon"
                            component="label"
                        >
                            <PublishIcon />
                        </Button>
                        <p>Video</p>
                    </div>

                    {source && (
                        <video
                            className="VideoInput_video"
                            width="100%"
                            height="300px"
                            controls
                            src={source}
                        />
                    )}
                </div>
                <div className="pic">
                    <div className={styles.img_upl}>
                        <input
                            style={{ display: "none" }}
                            id="raised-button-file"
                            type="file"
                            onChange={onChangePicture}
                        />
                        <Button
                            htmlFor="raised-button-file"
                            className="shapefile-icon"
                            component="label"
                        >
                            <PublishIcon />
                        </Button>
                        <p>Cover Photo</p>
                    </div>
                    <div className={styles.prevPic}>
                        <img src={imgData} alt="" className={styles.prevImg} />
                    </div>
                </div>
                <form>
                    <input className={styles.inputs} name="title" type="text" placeholder="Movie Title" onChange={handleChange}/>
                    <input className={styles.inputs} name="description" type="text" placeholder="Description" onChange={handleChange}/>
                    <input className={styles.inputs} name="director" type="text" placeholder="Director (full name)" onChange={handleChange}/>
                    <DatePicker className={styles.data} selected={startDate} onChange={(date) => setStartDate(date)} />
                    <button type="button" onClick={addMovie} className={styles.btn}>Ok</button>
                </form>
            </Modal>

        </div>
    );
}

export default Main;
