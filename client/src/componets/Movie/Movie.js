import React, {useEffect, useState} from "react";
import styles from "./Movie.module.css";
import Clamp from 'react-multiline-clamp';
import Button from "@material-ui/core/Button";
import PublishIcon from "@material-ui/icons/Publish";
import DatePicker from "react-datepicker";
import Modal from "react-modal";
import axios from "axios";

Modal.setAppElement("#root");

function Movies(props) {
    const [isOpen, setIsOpen] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [picture, setPicture] = useState(null);
    const [imgData, setImgData] = useState(`http://localhost:4000/${props.data.cover_image}`);
    const [inputs, setInputs] = useState({title:props.data.title, director:props.data.director, description:props.data.description});

    const handleChange = e => setInputs(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    const removeVideo = (videoId) => {
        fetch(`http://localhost:4000/api/v1/delete-movie/${videoId}`, {
            method: "DELETE",
        })
            .then((res) => res.json())
            .then(response => {
                const newVideo = props.allData.filter(img => img._id !== videoId)
                props.onDelete(newVideo)
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const updateVideo = (videoId) => {
        const formData = new FormData();
        formData.append('title', inputs.title)
        formData.append('description', inputs.description)
        formData.append('director', inputs.director)
        formData.append('date', startDate)
        if(picture !== null){
            formData.append('cover_image', picture)
            alert(55)
        }
        const url = `http://localhost:4000/api/v1/update-movie/${videoId}`
        axios.patch(url, formData).then((response) => {
            const tasks = [...props.allData];
            const foundTasksIndex = tasks.findIndex((task) => task._id === videoId);
            tasks[foundTasksIndex] = response.data.data;
            props.onDelete(tasks)
            console.log(response)
        }).catch((err) => {
            console.log(err)
        })
        setIsOpen(!isOpen);
    }

    function toggleModal() {
        setIsOpen(!isOpen);
    }

    const onChangePicture = e => {
        if (e.target.files[0].type && e.target.files[0].type.indexOf('image') === -1) {
            console.log('File is not an image.');
            return;
        }
        if (e.target.files[0]) {
            setPicture(e.target.files[0]);
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setImgData(reader.result);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    const date = new Date(props.data.date);
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const fullDate = monthNames[date.getMonth()] + ' ' + date.getFullYear()
    let formatedDate = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`
    let slectedDate = new Date(formatedDate)
    useEffect(() => {
        setStartDate(slectedDate)
    }, [])
    return (
        <div>
            <div className={styles.movies}>
                <div className={styles.block1}>
                    <p className={styles.name}>A movie by {props.data.director}</p>
                    <div className={styles.img_block}>
                        <img src={`http://localhost:4000/${props.data.cover_image}`} alt="sd"/>
                    </div>
                </div>
                <div className={styles.block2}>
                    <div className={styles.text_block}>
                        <h2>{props.data.title}</h2>
                        <Clamp withTooltip lines={10}>
                            <p className={styles.description}>{props.data.description}</p>
                        </Clamp>
                    </div>
                    <p className={styles.data}>{fullDate}</p>
                </div>
            </div>
            <div className={styles.butns}>
                <button onClick={toggleModal} className={styles.btns}>Update</button>
                <button
                    className={styles.btns}
                    onClick={() => {
                        removeVideo(props.data._id)
                    }}
                >Delete
                </button>
            </div>
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
                <h2>Edith Movie</h2>

                <div className="pic">
                    <div className={styles.img_upl}>
                        <input
                            style={{display: "none"}}
                            id="raised-button-file"
                            type="file"
                            onChange={onChangePicture}
                        />
                        <Button
                            htmlFor="raised-button-file"
                            className="shapefile-icon"
                            component="label"
                        >
                            <PublishIcon/>
                        </Button>
                        <p>Cover Photo</p>
                    </div>
                    <div className={styles.prevPic}>
                        <img src={imgData} alt="" className={styles.prevImg}/>
                    </div>
                </div>
                <form>
                    <input
                        className={styles.inputs}
                        type="text"
                        placeholder="Movie Title"
                        value={inputs.title}
                        onChange={handleChange}
                        name="title"
                    />
                    <input
                        className={styles.inputs}
                        type="text"
                        placeholder="Description"
                        value={inputs.description}
                        onChange={handleChange}
                        name="description"
                    />
                    <input
                        className={styles.inputs}
                        type="text"
                        placeholder="Director (full name)"
                        value={inputs.director}
                        onChange={handleChange}
                        name="director"
                    />
                    <DatePicker className={styles.dataa} selected={startDate} onChange={(date) => setStartDate(date)}/>
                    <button
                        type="button"
                        className={styles.btn}
                        onClick={() => {
                            updateVideo(props.data._id)
                        }}
                    >Update</button>
                </form>
            </Modal>
        </div>
    );
}
export default Movies;
