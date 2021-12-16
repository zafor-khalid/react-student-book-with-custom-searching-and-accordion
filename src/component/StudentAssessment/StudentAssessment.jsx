import React, { useEffect, useState } from 'react'
import './StudentAssessmant.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

const StudentAssessment = () => {
  const [studentData, setStudentData] = useState([])
  const [inputName, setInputName] = useState('')
  const [dataToShow, setDataToShow] = useState([])
  const [searchTag, setSearchTag] = useState([])
  const [allTags, setAllTags] = useState([])

  useEffect(() => {
    loadData()
    setInputName('')
  }, [])

  const loadData = () => {
    fetch('https://api.hatchways.io/assessment/students')
      .then((res) => res.json())
      .then((data) => {
        reformData(data)
      })
  }

  const reformData = (data) => {
    let arr = data.students
    for (let index = 0; index < arr.length; index++) {
      arr[index].tags = []
    }
    setStudentData(arr)
    setDataToShow(arr)
  }
  useEffect(() => {
    if (inputName === '') {
      setDataToShow(studentData)
    } else {
      filterByName()
    }
  }, [inputName])

  const filterByName = () => {
    let returnValue = studentData?.filter((dt) =>
      (dt.firstName + ' ' + dt.lastName)
        .toUpperCase()
        .includes(inputName.toUpperCase())
    )
    setDataToShow(returnValue)
  }

  useEffect(() => {
    if (searchTag === '') {
      setDataToShow(studentData)
    } else {
      filterByTag()
    }
  }, [searchTag])

  const filterByTag = () => {
    let returnValue = []
    for (let i of dataToShow) {
      for (let j of i.tags) {
        if (j.toUpperCase().includes(searchTag.toUpperCase())) {
          returnValue.push(i)
        }
      }
    }

    // let returnValue = dataToShow?.map(
    //   (dt) =>
    //     dt?.tags.filter((t) =>
    //       t.toUpperCase().includes(searchTag.toUpperCase())
    //     )
    // (dt.firstName + ' ' + dt.lastName)
    //     .toUpperCase()
    //     .includes(inputName.toUpperCase())
    // )
    setDataToShow(returnValue)
  }

  return (
    <div
      style={{
        margin: '0 auto',
        width: '55rem',
        height: '80vh',
        overflowY: 'scroll',
        backgroundColor: '#f8f8f8',
        padding: '1rem 0',
      }}
    >
      <input
        type='text'
        style={{
          display: 'block',
          margin: '0 auto',
          width: '95%',
          border: 'none',
          borderBottom: '1px solid lightGray',
          height: '2.5rem',
          fontSize: '1.25rem',
          paddingLeft: '1rem',
          color: '#252525',
          backgroundColor: 'transparent',
          outline: 'none',
        }}
        placeholder='search by name'
        onChange={(e) => setInputName(e.target.value)}
      />

      <input
        type='text'
        style={{
          display: 'block',
          margin: '1rem auto',
          width: '95%',
          border: 'none',
          borderBottom: '1px solid lightGray',
          height: '2.5rem',
          fontSize: '1.25rem',
          paddingLeft: '1rem',
          color: '#252525',
          backgroundColor: 'transparent',
          outline: 'none',
        }}
        placeholder='search by tag'
        onChange={(e) => setSearchTag(e.target.value)}
      />

      {dataToShow.length > 0 ? (
        dataToShow.map((dt, idx) => (
          <DropDown
            key={idx}
            dt={dt}
            allTags={allTags}
            insertTags={setAllTags}
            editToShow={setDataToShow}
            dataToShow={dataToShow}
          ></DropDown>
        ))
      ) : (
        <h2 style={{ margin: '10rem 0', color: 'gray', textAlign: 'center' }}>
          No Data Found!
        </h2>
      )}
    </div>
  )
}

export default StudentAssessment

const DropDown = ({ dt, allTags, insertTags, dataToShow }) => {
  const [visible, setVisible] = useState(false)
  const [tags, setTags] = useState([])
  const [value, setValue] = useState('')

  const getSum = (total, num) => {
    return total + Math.round(num)
  }

  const addTags = (tag) => {
    const temp = [...tags, tag]
    setTags(temp)
    // insertTags(tagsNow)
    for (let index = 0; index < dataToShow.length; index++) {
      if (dataToShow[index].id === dt.id) {
        dataToShow[index].tags = temp
      }
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      if (event.target.value.replace(/\s/g, '').length) {
        addTags(event.target.value)
      }

      setValue('')
    }
  }

  return (
    <div
      style={{
        width: '50rem',
        margin: 'auto',
        padding: '2rem',
        borderBottom: '1px solid #b1b1b1',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'start',
          }}
        >
          <img
            src={dt.pic}
            alt=''
            height='150'
            style={{
              aspectRatio: '1/1',
              // border: '1px solid #b1b1b1',
              borderRadius: '20rem',
              boxShadow: '1px 1px 5px #b1b1b1',
              marginRight: '2rem',
              marginTop: '1.2rem',
            }}
          />
          <div style={{ color: 'dimgray' }}>
            <h1 style={{ color: 'black' }}>
              {dt.firstName + ' ' + dt.lastName}
            </h1>
            <p>Email: {dt.email}</p>
            <p>Company: {dt.company}</p>
            <p>Skills: {dt.skill}</p>
            <p>Average: {dt.grades.reduce(getSum, 0) / dt.grades.length}%</p>

            <div>
              {visible &&
                dt?.grades.map((grade, idx) => (
                  <p key={idx}>
                    Test{idx + 1 + ': '}
                    {grade}
                  </p>
                ))}

              {!visible && (
                <div>
                  {dt?.tags.length > 0 &&
                    dt.tags.map((dt, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: 'lightGray',
                          padding: '.3rem .4rem',
                          borderRadius: '4px',
                          marginRight: '4px',
                          fontWeight: 'bold',
                        }}
                      >
                        {dt}
                      </span>
                    ))}
                </div>
              )}
              {!visible && (
                <input
                  type='text'
                  style={{
                    display: 'block',
                    margin: '0 auto',
                    width: '100%',
                    border: 'none',
                    borderBottom: '1px solid lightGray',
                    height: '2.5rem',
                    fontSize: '1.25rem',

                    color: '#252525',
                    backgroundColor: 'transparent',
                    outline: 'none',
                  }}
                  placeholder='insert tags'
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setValue(e.target.value)}
                  value={value}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div>
        <button
          style={{
            color: '#434343',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 1000ms ease',
          }}
          onClick={() => {
            setVisible(!visible)
          }}
        >
          {!visible ? (
            <FontAwesomeIcon
              icon={faPlus}
              style={{
                height: '2rem',
                width: '2rem',
                animation: 'example .3s 1',
              }}
            />
          ) : (
            <FontAwesomeIcon
              icon={faMinus}
              style={{
                height: '2rem',
                width: '2rem',
                animation: 'example1 .3s 1',
              }}
              transitionAppearTimeout={500}
            />
          )}
        </button>
      </div>
    </div>
    // <div onClick={() => setVisible(!visible)}>
    //   {!visible ? (
    //     <FontAwesomeIcon
    //       icon={faPlus}
    //       style={{
    //         height: '2rem',
    //         width: '2rem',
    //         animation: 'example .3s 1',
    //       }}
    //     />
    //   ) : (
    //     <FontAwesomeIcon
    //       icon={faMinus}
    //       style={{
    //         height: '2rem',
    //         width: '2rem',
    //         animation: 'example1 .3s 1',
    //       }}
    //       transitionAppearTimeout={500}
    //     />
    //   )}
    // </div>
  )
}

// const ShowData = ({ dt }) => {
//   return (
//     <div>
//       {dt?.grades.map((grade, idx) => (
//         <p key={idx}>
//           Test{idx + 1 + ': '}
//           {grade}
//         </p>
//       ))}
//     </div>
//   )
// }

// <FontAwesomeIcon
// icon={faMinus}
// style={{
//   height: '2rem',
//   width: '2rem',
//   animation: 'example1 .3s 1',
// }}
// transitionAppearTimeout={500}
// />
// {index === idx &&
// dt?.grades.map((grade, idx) => (
//   <p key={idx}>
//     Test{idx + 1 + ': '}
//     {grade}
//   </p>
// ))}
