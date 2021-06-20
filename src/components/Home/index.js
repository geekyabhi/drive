import React, { useEffect } from 'react'
import styles from './styles.module.css'
import Navbar from '../Navbar/index'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Modals from '../Modal/index'

function Home() {

    const history=useHistory()
    
    const userLogin=useSelector(state=>state.userLogin)
    const {userInfo}=userLogin

    useEffect(() => {
        if(!userInfo){
            history.push('/')
        }
    // eslint-disable-next-line
    }, [userInfo])

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
                    <button className={styles.optionBtn}>
                        My Drive
                    </button>
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
            </div>
            {/* Right Part */}
            <div className={styles.rightBox}>
                {/* Files To Show */}
            </div>
        </div>
    )
}


export default Home