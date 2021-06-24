import React from 'react'
import {Link, useHistory} from 'react-router-dom'
import styles from './styles.module.css'
import Navbar from '../Navbar/index'
// import { useSelector } from 'react-redux'
import Modals from '../Modal/index'
import emptyImg from '../../assets/img/empty.png'
import { Button } from 'react-bootstrap'
function Drive() {
    const history=useHistory()
    return (
        <div className="">
            {/* Navbar */}
            <Navbar />
            {/* Main Content(20:80) */}
            <div className="my-2 d-flex justify-content-flex-start">
                {/* Left Part(20%) */}
                <div className={styles.leftSideBar}>
                    {/* Add File/Folder */}
                    <Modals />
                    <br />
                    <Link to="/drive" className={styles.optionBtn}>
                        My Drive
                    </Link>
                    <button className={styles.optionBtn}>
                        Computers
                    </button>
                    <button className={styles.optionBtn}>
                        Shared with me
                    </button>
                     <button className={styles.optionBtn}>
                        Recent
                    </button>
                    <button className={styles.optionBtn}>
                        Starred
                    </button>
                </div>
           
            {/* Right Part */}
            <div className={styles.rightBox}>
                {/* Files To Show */}
                <div className="mt-4"><Button className={styles.backButton} onClick={()=>history.push('/home')}>Back</Button></div>
                <div className="row p-3">
                    {/* One File */}
                    <h2>Drive</h2>
                    <img src={emptyImg} className={styles.emptyImg} alt="empty_img" />
                </div>
            </div>
           </div>
        </div>
    )
}

export default Drive
